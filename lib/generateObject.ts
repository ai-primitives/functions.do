import { FunctionDefinition } from '@/package/types'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { sample } from 'lodash-es'
import { generateSchema } from './generateSchema'
import { zodToJsonSchema } from "zod-to-json-schema"
import { z } from 'zod'


// const openRouter = createOpenRouter({ 
//   // baseURL: process.env.AI_GATEWAY_URL!,
//   baseURL: 'https://gateway.ai.cloudflare.com/v1/a826340b3b93189c9ebb7c0eaeba3c46/functions/openrouter',
//   headers: {
//     'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
//     'X-Title': 'Functions.do', // Optional. Site name for rankings on openrouter.ai.
//   }
// })



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

type GenerateObjectArgs = {
  functionName: string
  input: any,
  model?: string
  schema?: FunctionDefinition
  settings?: {
    system?: string
    prompt?: string
    temperature?: number
    seed?: number
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
  const modelName  = args.model || sample(defaultModels)!
  const { functionName, input, settings } = args
  // const model = openRouter(modelName)
  let { system = 'Respond only in JSON.', temperature, seed } = settings || {}
  const prompt = `${functionName}(${JSON.stringify(input, null, 2)})`


  const openRouter = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.AI_GATEWAY_URL || 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
      'X-Title': 'Functions.do', // Optional. Site name for rankings on openrouter.ai.
    }
  })

  const useTools = modelName.startsWith('anthropic')
  const structuredOutputs = useTools ? false : true

  const results = args.schema ? 
    await generateObject({
      model: openRouter(modelName, { structuredOutputs }),
      system,
      prompt,
      mode: useTools ? 'tool' : 'json',
      schema: generateSchema(args.schema),
      temperature,
      seed,
    }) :
    await generateObject({
      model: openRouter(modelName),
      system,
      prompt,
      output: 'no-schema',
      temperature,
      seed,
    })
  const { object = {} } = results as any
  const { id, modelId  } = results.response
  console.log(results)
  console.log(results.response)

  const cache = results.response.headers?.['cf-aig-cache-status']

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
  const data = { functionName, results, modelName, model: modelId, id, object, cache, error }
  console.log(data)
  return data
}
