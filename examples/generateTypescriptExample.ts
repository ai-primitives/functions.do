import { generateTypescript } from '../ai/generateTypescript'

async function runExample() {
  try {
    console.log('Generating TypeScript code...')
    
    const result = await generateTypescript({
      prompt: 'Create a function that sorts an array of objects by a specified property, with support for ascending and descending order',
      system: 'You are an expert TypeScript developer. Generate clean, well-documented code with comprehensive tests.',
      model: 'claude-3-7-sonnet-20250219',
      useAnthropic: true
    })
    
    console.log('\nGenerated TypeScript Function:')
    console.log('Name:', result.name)
    console.log('Description:', result.description)
    console.log('Type:', result.type)
    
    console.log('\nCode:')
    console.log(result.code)
    
    console.log('\nTests:')
    console.log(result.tests)
    
    // Uncomment to see reasoning details
    // console.log('\nReasoning:')
    // console.log(result.reasoning)
  } catch (error) {
    console.error('Error generating TypeScript:', error)
  }
}

runExample()
