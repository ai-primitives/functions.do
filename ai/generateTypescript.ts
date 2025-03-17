// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '../lib/generateObject'
import { generateObject } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import dedent from 'dedent'
import { z } from 'zod'

const anthropic = createAnthropic({
  baseURL: process.env.AI_GATEWAY_URL,
})

/**
 * Generates TypeScript code based on a prompt
 */
export const generateTypescript = async (args: {
  model?: string
  prompt: string
  system?: string
  useAnthropic?: boolean
}) => {
  const { 
    model = 'claude-3-7-sonnet-20250219',
    prompt, 
    system = 'You are an expert Typescript architect and developer.',
    useAnthropic = true
  } = args
  
  const aiModel = useAnthropic 
    ? anthropic(model, { sendReasoning: true })
    : openRouter(model, { structuredOutputs: true })
  
  return generateObject({
    model: aiModel,
    system: dedent`${system}`,
    prompt: prompt,
    providerOptions: useAnthropic ? {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 12000 },
      }
    } : undefined,
    schema: z.object({
      name: z.string(),
      description: z.string(),
      type: z.string({ description: 'The Typescript type of the function, for example: `(x: number) => number`'}),
      tests: z.string({ description: 'Use Vitest to define as many unit tests as necessary for both happy path and edge case scenarios. The `describe`, `it`, and `expect` functions are already imported and in scope.' }),
      code: z.string({ description: 'The Typescript code of the function. Start with `export const ...`' }),
    }),
  }).then(results => {
    const { object, reasoning, reasoningDetails } = results as any
    return { ...object, reasoning, reasoningDetails }
  })
}
