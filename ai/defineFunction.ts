// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '@/lib/generateObject'
import { generateObject } from 'ai'
import { z } from 'zod'


export const defineFunction = async (args: any) => generateObject({
  model: openRouter('google/gemini-2.0-flash-001', { structuredOutputs: true }),
  system: 'You are a function definition assistant.',
  prompt: 'Define a function.',
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
