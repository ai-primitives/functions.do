import { AI } from '../package'

export default AI({

  buildWorkflow: async ({ ai, args }) => {
    
    // const { functions, ...workflow } = await ai.listFunctions(args)
    // const functionDefinitions = await Promise.all(functions.map(fn => ai.defineFunction({ function: fn, ...workflow })))
    // return { ...workflow, functions: functionDefinitions }

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

