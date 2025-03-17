// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '@/lib/generateObject'
import { generateText } from 'ai'


export const generateMarkdown = async (args: any) => generateText({
  model: openRouter('google/gemini-2.0-flash-001'),
  system: 'You are a markdown generator.',
  prompt: 'Generate markdown.',
}).then(results => results.text)
