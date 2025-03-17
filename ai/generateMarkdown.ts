// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '../lib/generateObject'
import { generateText } from 'ai'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import type { Root } from 'mdast'

/**
 * Generates markdown content based on a prompt and returns both the text and AST
 */
export const generateMarkdown = async (args: {
  model?: string
  prompt: string
  system?: string
}) => {
  const { 
    model = 'google/gemini-2.0-flash-001', 
    prompt, 
    system = 'You are a markdown generator.' 
  } = args
  
  return generateText({
    model: openRouter(model),
    system,
    prompt,
  }).then(results => {
    const { text } = results
    
    // Parse markdown to MDAST
    const ast = fromMarkdown(text, {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()]
    }) as Root
    
    return {
      text,
      ast
    }
  })
}
