import { generateMarkdown } from '../ai/generateMarkdown'

async function runExample() {
  try {
    console.log('Generating markdown content...')
    
    const result = await generateMarkdown({
      prompt: 'Write a short tutorial on how to use TypeScript with React',
      system: 'You are a helpful programming instructor. Generate clear, concise markdown with code examples.',
      model: 'google/gemini-2.0-flash-001'
    })
    
    console.log('\nGenerated Markdown Text:')
    console.log(result.text)
    
    console.log('\nAST Structure (first few nodes):')
    console.log(JSON.stringify(result.ast.children.slice(0, 2), null, 2))
    
    console.log('\nTotal AST Nodes:', result.ast.children.length)
  } catch (error) {
    console.error('Error generating markdown:', error)
  }
}

runExample()
