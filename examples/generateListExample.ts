import { generateList } from '../ai/generateList'

async function runExample() {
  try {
    console.log('Generating a list of top 5 programming languages...')
    
    const list = await generateList({
      prompt: 'Generate a list of the top 5 programming languages in 2025 with a brief description of each',
      system: 'You are a helpful programming expert. Respond only with a numbered, markdown ordered list.',
      model: 'google/gemini-2.0-flash-001'
    })
    
    console.log('\nGenerated List:')
    console.log(JSON.stringify(list, null, 2))
    
    console.log('\nFormatted Output:')
    list.forEach((item, index) => {
      console.log(`${index + 1}. ${item.text}`)
      
      if (item.children?.length) {
        item.children.forEach((child, childIndex) => {
          console.log(`   ${childIndex + 1}. ${child.text}`)
        })
      }
    })
  } catch (error) {
    console.error('Error generating list:', error)
  }
}

runExample()
