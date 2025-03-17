// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '../lib/generateObject'
import { generateObject } from 'ai'
import { z } from 'zod'

/**
 * Defines a function schema based on a prompt
 */
export const defineFunction = async (args: {
  model?: string
  prompt: string
  system?: string
}) => {
  const { 
    model = 'google/gemini-2.0-flash-001', 
    prompt, 
    system = 'You are a function definition assistant.' 
  } = args
  
  return generateObject({
    model: openRouter(model, { structuredOutputs: true }),
    system,
    prompt,
    schema: z.object({
      name: z.string(),
      description: z.string(),
      parameters: z.object({
        type: z.string(),
        properties: z.record(z.string(), z.any()),
        required: z.array(z.string()),
      }),
    }),
  }).then(results => results.object)
}
