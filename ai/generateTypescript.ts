// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '@/lib/generateObject'
import { generateObject } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import dedent from 'dedent'
import { z } from 'zod'

const anthropic = createAnthropic({
  baseURL: process.env.AI_GATEWAY_URL,
})


export const defineFunction = async (args: any) => generateObject({
  model: anthropic('claude-3-7-sonnet-20250219', { sendReasoning: true }),
  system: dedent`
    You are an expert Typescript architect and developer.
  `,
  prompt: 'Define a function:\n\n' + JSON.stringify(args, null, 2),
  providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    }
  },
  schema: z.object({
    name: z.string(),
    description: z.string(),
    type: z.string({ description: 'The Typescript type of the function, for example: `(x: number) => number`'}),
    tests: z.string({ description: 'Use Vitest to define as many unit tests as necessary for both happy path and edge case scenarios. The `describe`, `it`, and `expect` functions are already imported and in scope.' }),
    code: z.string({ description: 'The Typescript code of the function. Start with `export const ...`' }),
  }),
}).then(results => {
  console.log(results)
  const { object, reasoning, reasoningDetails } = results as any
  return { ...object, reasoning, reasoningDetails }
})
