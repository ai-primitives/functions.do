import { AI } from '../package'

export default AI({

  buildWorkflow: async ({ ai, args }) => {
    
    const workflow = await ai.listFunctions(args)
    const functions = await Promise.all(workflow.functions.map(ai.defineFunction))

  },

  listFunctions: {
    workflow: 'Describe the workflow that the functions will be used for',
    persona: 'Who is the target persona who performs this workflow? Like expert developer or startup founder, etc.',
    category: 'What category is this workflow and functions? (e.g. marketing, sales, software, etc.)',
    functions: ['List descriptive functionNames in camelCase with a description of what each function does']
  },

  defineFunction: {
    name: 'Name of the function',
    description: 'Description of what the function does',
  }

})

