import { FunctionDefinition } from '@/package/types'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
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
  const zodSchema = args.schema ? generateSchema(args.schema) : undefined
  let json_schema: any = zodSchema ? { name: functionName, schema: zodToJsonSchema(zodSchema) } : undefined
  if (json_schema) {
    delete json_schema.schema?.$schema
  }
  const response_format = args.schema ? { type: 'json_schema', json_schema } : { type: 'json_object' }
  console.log({ modelName, json_schema })
  const url = (process.env.AI_GATEWAY_URL || 'https://openrouter.ai/api/v1') + '/chat/completions'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
      'X-Title': 'Functions.do', // Optional. Site name for rankings on openrouter.ai.
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
      response_format,
      temperature,
      seed,
    })
  })
  const headers = Object.fromEntries(response.headers)
  // console.log(headers)
  const { id } = headers
  const cache = headers['cf-aig-cache-status']
  const status = `${response.status}: ${response.statusText}`
  const results = await response.json()
  console.log(results)
  // const results = args.schema ? 
  //   await generateObject({
  //     model,
  //     system,
  //     prompt,
  //     mode: 'json',
  //     schema: generateSchema(args.schema),
  //   } as any) :
  //   await generateObject({
  //     model,
  //     system,
  //     prompt,
  //     output: 'no-schema',
  //   })
  // const { object, reasoning } = results as any
  const { model, provider } = results
  const message = results.choices[0].message
  const { content, reasoning, refusal } = message || {}
  let object: any
  let error: any
  try {
    const parsedContent = content.replace(/```json/, '').replace(/```/, '')
    object = JSON.parse(parsedContent)
    // if (zodSchema) {
    //   object = zodSchema.parse(object)
    // }
  } catch(e: any) {
    console.log(e)
    error = e.message
  }
  // console.log(results)
  const data = { results, modelName, model, provider, id, status, cache, object, reasoning, refusal, error, json_schema }
  console.log(data)
  return data
}
