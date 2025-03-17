// TODO: Refactor to use `ai-function` once the API and implementation are finalized
import { openRouter } from '../lib/generateObject'
import { generateText } from 'ai'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import type { Root, List, ListItem, Paragraph, Text } from 'mdast'

interface ListItemContent {
  text: string
  children?: ListItemContent[]
}

/**
 * Extracts list items from MDAST list nodes recursively
 */
const extractListItems = (list: List): ListItemContent[] => {
  return list.children.map((item: ListItem) => {
    const result: ListItemContent = { text: '' }
    
    // Process the first paragraph in the list item to get the text
    const firstChild = item.children[0]
    if (firstChild.type === 'paragraph') {
      const paragraph = firstChild as Paragraph
      result.text = paragraph.children
        .filter((child: Paragraph['children'][number]): child is Text => child.type === 'text')
        .map((textNode: Text) => textNode.value)
        .join('')
    }
    
    // Check for nested lists
    const nestedList = item.children.find((child: ListItem['children'][number]): child is List => 
      child.type === 'list'
    ) as List | undefined
    
    if (nestedList) {
      result.children = extractListItems(nestedList)
    }
    
    return result
  })
}

/**
 * Generates a markdown ordered list and parses it into a structured format
 */
export const generateList = async (args: {
  model?: string
  prompt: string
  system?: string
}): Promise<ListItemContent[]> => {
  const { 
    model = 'google/gemini-2.0-flash-001', 
    prompt, 
    system = 'Respond only with a numbered, markdown ordered list.' } = args
  
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
    
    // Find the first list in the AST
    const firstList = ast.children.find((node: Root['children'][number]): node is List => 
      node.type === 'list'
    ) as List | undefined
    
    if (!firstList) {
      return []
    }
    
    return extractListItems(firstList)
  })
}
