import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateList } from './generateList'
import { generateText } from 'ai'

// Create a minimal mock of GenerateTextResult
type MockGenerateTextResult = {
  text: string
  reasoning?: string
  reasoningDetails: any[]
  sources: any[]
  experimental_output?: any
  // Add other required properties
  usage?: any
  provider?: any
  model?: any
  warnings?: any[]
  finishReason?: string
  steps?: any[]
  toolCalls?: any[]
  toolResults?: any[]
}

// Mock the generateText function
vi.mock('ai', () => ({
  generateText: vi.fn(),
}))

describe('generateList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should parse a simple ordered list', async () => {
    // Mock the response from generateText
    const mockMarkdown = `
1. First item
2. Second item
3. Third item
`
    
    const mockResult: MockGenerateTextResult = {
      text: mockMarkdown,
      reasoningDetails: [],
      sources: [],
    }
    
    vi.mocked(generateText).mockResolvedValue(mockResult as any)

    const result = await generateList({ 
      prompt: 'Generate a list of items',
      model: 'google/gemini-2.0-flash-001'
    })

    expect(result).toEqual([
      { text: 'First item' },
      { text: 'Second item' },
      { text: 'Third item' },
    ])
  })

  it('should parse a nested ordered list', async () => {
    // Mock the response with a nested list
    const mockMarkdown = `
1. First item
   1. Nested item 1
   2. Nested item 2
2. Second item
3. Third item
   1. Nested item 3
   2. Nested item 4
`
    
    const mockResult: MockGenerateTextResult = {
      text: mockMarkdown,
      reasoningDetails: [],
      sources: [],
    }
    
    vi.mocked(generateText).mockResolvedValue(mockResult as any)

    const result = await generateList({ 
      prompt: 'Generate a nested list',
      model: 'google/gemini-2.0-flash-001'
    })

    expect(result).toEqual([
      { 
        text: 'First item',
        children: [
          { text: 'Nested item 1' },
          { text: 'Nested item 2' },
        ] 
      },
      { text: 'Second item' },
      { 
        text: 'Third item',
        children: [
          { text: 'Nested item 3' },
          { text: 'Nested item 4' },
        ] 
      },
    ])
  })

  it('should handle non-list markdown content', async () => {
    // Mock a response that doesn't contain a list
    const mockMarkdown = `# This is a heading

This is just a paragraph of text without any list.
`
    
    const mockResult: MockGenerateTextResult = {
      text: mockMarkdown,
      reasoningDetails: [],
      sources: [],
    }
    
    vi.mocked(generateText).mockResolvedValue(mockResult as any)

    const result = await generateList({ 
      prompt: 'Generate content',
      model: 'google/gemini-2.0-flash-001'
    })

    // Should return an empty array when no list is found
    expect(result).toEqual([])
  })
})
