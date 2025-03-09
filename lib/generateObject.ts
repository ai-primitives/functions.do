import { FunctionDefinition } from '@/package/types'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { generateObject } from 'ai'
import { sample } from 'lodash-es'
import { generateSchema } from './generateSchema'
import { z } from 'zod'


const openRouter = createOpenRouter({ 
  // baseURL: process.env.AI_GATEWAY_URL!,
  baseURL: 'https://gateway.ai.cloudflare.com/v1/a826340b3b93189c9ebb7c0eaeba3c46/functions/openrouter',
  headers: {
    'HTTP-Referer': 'https://functions.do', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Functions.do', // Optional. Site name for rankings on openrouter.ai.
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

type GenerateObjectArgs = {
  functionName: string
  args: any,
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
  const modelName = args.model || sample(defaultModels)!
  const model = openRouter(modelName)
  let { system = 'Respond only in JSON: do not wrap with ```json\n\n```' } = args.settings || {}
  const prompt = `${args.functionName}(${JSON.stringify(args.args, null, 2)})`
  console.log({ modelName })
  const results = args.schema ? 
    await generateObject({
      model,
      system,
      prompt,
      mode: 'json',
      schema: generateSchema(args.schema),
    } as any) :
    await generateObject({
      model,
      system,
      prompt,
      output: 'no-schema',
    })
  const { object, reasoning } = results as any
  // console.log(results)
  console.log({ results, modelName, object, reasoning })
  return results as any
}
