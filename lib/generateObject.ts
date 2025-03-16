import { FunctionDefinition } from '@/package/types'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject, RepairTextFunction } from 'ai'
import { sample } from 'lodash-es'
import { generateSchema } from './generateSchema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { z } from 'zod'
import { waitUntil } from '@vercel/functions'
import configPromise from 'payload.config'
import { getPayload } from 'payload'
import hashObject from 'object-hash'

const openRouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.AI_GATEWAY_URL || 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Functions.do', // Optional. Site name for rankings on openrouter.ai.
  },
  fetch: async (input, init) => {
    // console.log('fetching', { input, init })
    const response = await fetch(input, init)
    const clonedResponse = response.clone()
    const body = await clonedResponse.json()
    console.log(body)
    return response
  }
})

const defaultModels = [
  'qwen/qwq-32b',
  'deepseek/deepseek-r1',
  'openai/gpt-4o',
  'openai/gpt-4o-2024-08-06',
  'openai/gpt-4o-2024-11-20',
  'openai/gpt-4o-mini',
  'openai/gpt-4o-mini-2024-07-18',
  'openai/gpt-4.5-preview',
  'openai/o1',
  'openai/o3-mini',
  'openai/o3-mini-high',
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-3.7-sonnet',
  'anthropic/claude-3.7-sonnet:thinking',
  'anthropic/claude-3.7-sonnet:beta',
  'google/gemini-2.0-flash-001',
  'google/gemini-2.0-flash-lite-001',
  'google/gemini-2.0-flash-thinking-exp:free',
  'google/gemini-2.0-pro-exp-02-05:free',
  'meta-llama/llama-3.3-70b-instruct',
]

export const experimental_repairText: RepairTextFunction = async ({ text, error }) => {
  // example: add a closing brace to the text
  console.log({ text, error })
  if (text === '') text = '{}'
  const repairedText = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
  console.log({ repairedText })
  return repairedText
}

type GenerateObjectArgs = {
  functionName: string
  input: any
  model?: string
  tenant?: string
  schema?: FunctionDefinition
  settings?: {
    system?: string
    prompt?: string
    temperature?: number | string
    seed?: number | string
    topK?: number | string
    topP?: number | string
  }
}

/**
 * Default generate object implementation. It will generate an object based on the given schema
 * using the `generateObject` function from the `ai` package. It will use a randomly selected model
 * from the `defaultModels` array.
 * @param schema The schema to generate the object from.
 * @returns The generated object.
 */
export default async (args: GenerateObjectArgs) => {
  const modelName = args.model || sample(defaultModels)!
  const { functionName, input, settings, tenant } = args
  // const model = openRouter(modelName)
  let { system, prompt, temperature = 2, seed, topK, topP } = settings || {}
  if (typeof temperature === 'string') temperature = parseFloat(temperature)
  if (typeof seed === 'string') seed = parseInt(seed)
  if (typeof topK === 'string') topK = parseInt(topK)
  if (typeof topP === 'string') topP = parseFloat(topP)


  const payload = await getPayload({ config: configPromise })

  // const dbStart = Date.now()
  // const savedFunction = await payload.find({
  //   collection: 'functions',
  //   where: { 
  //     name: { equals: functionName },
  //     tenant: { equals: args.tenant }, 
  //   },
  //   depth: 2,
  // })
  // const dbLatency = Date.now() - dbStart

  // console.log(savedFunction, { dbLatency })

  if (!system) system = 'Respond only in JSON.'
  if (!prompt) prompt = `${functionName}(${JSON.stringify(input, null, 2)})`


  const start = Date.now()

  

  const useTools = modelName.startsWith('anthropic')
  const structuredOutputs = useTools ? false : true

  const results = args.schema
    ? await generateObject({
        model: openRouter(modelName, { structuredOutputs }),
        system,
        prompt,
        mode: useTools ? 'tool' : 'json',
        schema: generateSchema(args.schema),
        experimental_repairText,
        temperature,
        seed,
        topK,
        topP,
      })
    : await generateObject({
        model: openRouter(modelName),
        system,
        prompt,
        output: 'no-schema',
        experimental_repairText,
        temperature,
        seed,
        topK,
        topP,
      })
  
  const { object = {} } = results as any
  const { id, modelId } = results.response
  console.log(results)
  console.log(results.response)

  const cache = results.response.headers?.['cf-aig-cache-status']


  waitUntil(
    payload.create({
      collection: 'completions',
      data: {
        tenant,
        // hash: inputHash,
        functionName,
        // function: func.docs[0],
        input: input ? input : args,
        output: object,
        model: modelId,
        requestId: id,
        debug: results as any,
        // reasoning: completionResult.,
        seed,
        // latency,
      },
    }),
  )

  waitUntil(
    payload.create({
      collection: 'data',
      data: {
        // tenant,
        data: object
        // hash: inputHash,
        // functionName,
        // // function: func.docs[0],
        // input: input ? input : args,
        // output: object,
        // model: modelId,
        // requestId: id,
        // debug: results as any,
        // // reasoning: completionResult.,
        // seed,
        // // latency,
      },
    }),
  )

  // console.log(headers)
  // const { id } = headers
  // const cache = headers['cf-aig-cache-status']
  // const status = `${response.status}: ${response.statusText}`
  // const results = await response.json()
  // console.log(results)

  // const { model, provider } = results
  // const message = results.choices[0].message
  // let { content, reasoning, refusal } = message || {}
  // let object: any
  let error: any
  // Fixing the bug in Qwen QwQ where the content is empty but JSON in the reasoning
  // if (content === '' && reasoning && reasoning != '') content = reasoning
  // const parsedContent = content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
  // try {
  //   object = JSON.parse(parsedContent)
  // } catch(e: any) {
  //   console.log(e, parsedContent)
  //   error = e.message
  // }
  // let validation: any = { valid: true }
  // if (zodSchema) {
  //   try {
  //     object = zodSchema.parse(object)
  //   } catch(e: any) {
  //     validation = JSON.parse(e.message)
  //   }
  // }
  // console.log(results)
  // const data = { functionName, results, modelName, model, provider, id, status, cache, object, reasoning, refusal, error, json_schema, validation }
  const latency = Date.now() - start
  const data = { functionName, results, modelName, model: modelId, id, object, cache, error, latency }
  console.log(data)
  return data
}
