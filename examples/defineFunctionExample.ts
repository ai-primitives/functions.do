import { defineFunction } from '../ai/defineFunction'

async function runExample() {
  try {
    console.log('Defining a function schema...')
    
    const functionSchema = await defineFunction({
      prompt: 'Create a function that calculates the total price of items in a shopping cart, with support for discounts and taxes',
      system: 'You are a function definition expert. Define clear, well-structured functions with appropriate parameters.',
      model: 'google/gemini-2.0-flash-001'
    })
    
    console.log('\nGenerated Function Schema:')
    console.log(JSON.stringify(functionSchema, null, 2))
  } catch (error) {
    console.error('Error defining function:', error)
  }
}

runExample()
