import { AI } from '../package'

const createFunctions = AI({
  // List functions that will be part of a workflow
  listFunctions: {
    workflow: 'Describe the workflow that the functions will be used for',
    persona: 'Who is the target persona who performs this workflow? Like expert developer or startup founder, etc.',
    category: 'What category is this workflow and functions? (e.g. marketing, sales, software, etc.)',
    context: 'Provide additional context or background about the workflow or domain',
    functions: ['List descriptive functionNames in camelCase with a description of what each function does']
  },

  // Define a single function's structure and parameters
  defineFunction: {
    name: 'Name of the function in camelCase',
    description: 'Detailed description of what the function does and its purpose',
    category: 'Category this function belongs to (e.g., marketing, sales, development)',
    inputParameters: [
      {
        name: 'parameterName',
        type: 'string | number | boolean | object | array',
        description: 'Description of what this parameter is used for',
        isRequired: 'true or false',
        defaultValue: 'Default value if any (optional)',
        validations: ['Any validation rules that apply to this parameter (optional)'],
        examples: ['Example values for this parameter']
      }
    ],
    outputStructure: {
      description: 'Description of the output structure',
      type: 'string | number | boolean | object | array',
      schema: 'JSON schema for complex output types (optional)',
      examples: ['Example outputs from this function']
    },
    usageTips: ['Tips for effectively using this function'],
    relatedFunctions: ['Names of related or complementary functions'],
    codeTemplate: 'Template code showing how to implement this function',
    implementation: 'Suggested implementation logic for the function'
  },

  // Generate complete function implementation with JSDoc
  generateFunction: {
    name: 'Name of the function in camelCase',
    description: 'Detailed description of what the function does',
    parameters: [
      {
        name: 'paramName',
        type: 'string | number | boolean | object | array',
        description: 'Parameter description',
        isRequired: 'true or false'
      }
    ],
    returnType: 'Type of the return value',
    returnDescription: 'Description of what the function returns',
    examples: [
      {
        description: 'Example description',
        code: 'Example code showing function usage',
        result: 'Expected result of the example'
      }
    ],
    implementation: 'Full implementation of the function with appropriate error handling and best practices'
  },

  // Generate a complete workflow file with multiple functions
  generateWorkflow: {
    workflowName: 'Name of the workflow in camelCase',
    description: 'Description of what this workflow accomplishes',
    category: 'Category this workflow belongs to',
    persona: 'Target user persona for this workflow',
    functions: [
      {
        name: 'functionName',
        description: 'Function description',
        parameters: {}, // Parameter structure for this function
        returnValue: {}, // Return value structure
        implementation: 'Function implementation'
      }
    ],
    examples: [
      {
        description: 'Example workflow usage',
        code: 'Example code showing how functions work together'
      }
    ],
    fileStructure: 'Recommended file structure for implementing this workflow'
  },

  // Export functions as TypeScript types
  generateTypeDefinitions: {
    workflowName: 'Name of the workflow',
    functions: ['List of function names to generate types for'],
    outputFormat: 'TypeScript interface | type alias | class',
    includeJSDoc: 'true or false', // Whether to include JSDoc comments
    includeExamples: 'true or false' // Whether to include example usage in comments
  }
})

// Export the AI functions
export default createFunctions

// Example function to demonstrate usage
const runCreateFunctions = async () => {
  console.log('Starting function creation workflow...')
  
  // Step 1: List functions for a workflow
  const functionsForWorkflow = await createFunctions.listFunctions({
    workflow: 'Content creation and publishing for blog posts',
    persona: 'Content marketer at a SaaS company',
    category: 'marketing',
    context: 'Need to streamline the process of creating, editing and publishing blog content'
  })
  
  console.log('Functions for workflow:', functionsForWorkflow)
  
  // Step 2: Define one of the functions from the list
  const blogPostFunction = await createFunctions.defineFunction({
    name: 'generateBlogPostFromKeywords',
    description: 'Generates a complete blog post draft from a set of target keywords and an outline'
  })
  
  console.log('Blog post function definition:', blogPostFunction)
  
  // Step 3: Generate complete function with implementation
  const fullFunction = await createFunctions.generateFunction({
    name: 'generateBlogPostFromKeywords',
    description: 'Generates a complete blog post draft from a set of target keywords and an outline'
  })
  
  console.log('Full function implementation created')
  
  return {
    functionsForWorkflow,
    blogPostFunction,
    fullFunction
  }
}

// Uncomment to run the example
// runCreateFunctions().catch(console.error)
