import { AIConfig, AIFunction, FunctionDefinition, FunctionCallback, SchemaValue, AI_Instance, SchemaToOutput, createStringArray } from './types'

// Helper to ensure TypeScript correctly infers array element types in map operations
// TypeScript has a known issue with inferring the correct element type in .map() calls
// for arrays that come from dynamic sources (like API calls)

// Helper to generate the API request payload
const generateRequest = (functionName: string, schema: FunctionDefinition, input: any, config: AIConfig) => {
  return {
    functionName,
    schema,
    input,
    config,
  }
}

// Helper to call the functions.do API
const callAPI = async (request: any) => {
  const url = process.env.FUNCTIONS_API_URL || 'https://functions.do/api/generate'
  console.log({ url })
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${process.env.FUNCTIONS_DO_API_KEY}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    console.log(response.status, response.statusText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = (await response.json()) as any
  console.log(data)
  return data
}

// Define a more precise type for schema objects with functions array to help with type inference
interface WithFunctionsArray {
  functions: string[]
}

// Helper to generate a function from schema and config
const createFunction = <T extends FunctionDefinition>(name: string, schema: T, config?: AIConfig) => {
  // Extract the output type from the schema, ensuring arrays are handled properly
  type OutputType = SchemaToOutput<T>
  
  // Define specialized output type to improve inference for array elements
  type SpecializedOutputType = T extends { functions: any[] } 
    ? OutputType & WithFunctionsArray 
    : OutputType

  // Return a typed function to ensure TypeScript properly infers types from schema
  const typedFunction = async (input: any, functionConfig?: AIConfig): Promise<SpecializedOutputType> => {
    const mergedConfig = { ...config, ...functionConfig }
    const request = generateRequest(name, schema, input, mergedConfig)

    try {
      const response = (await callAPI(request)) as any
      const result = response.data ?? response

      // Special handling for listFunctions to ensure string arrays have proper type inference
      if (name === 'listFunctions') {
        // Create a properly typed result with a copy of the original
        const typedResult = { ...result }
        
        // Use our createStringArray utility to ensure proper type inference for .map() operations
        // This generates a branded StringArray that TypeScript can fully understand
        typedResult.functions = createStringArray(typedResult.functions)
        
        // Return the result with properly typed functions array
        return typedResult as SpecializedOutputType
      }
      
      // Ensure schema shapes are preserved for TypeScript with better type inference
      for (const key in schema) {
        // If schema defines an array property and result has that property
        if (Array.isArray(schema[key]) && result[key]) {
          // Get the array from the result, ensuring it's actually an array
          const resultArray = Array.isArray(result[key]) ? result[key] : [result[key]]
          
          // Determine what type of array we're working with
          const schemaArray = schema[key] as any[]
          
          if (schemaArray.length > 0 && typeof schemaArray[0] === 'string') {
            // For string arrays, ensure proper typing for .map() calls by adding the __element property
            result[key] = Object.assign(
              resultArray.map(item => typeof item === 'string' ? item : String(item)),
              { __element: '' } // This property helps TypeScript infer string element type
            )
          } else {
            // For other arrays, ensure they're tagged with the TypedArray marker
            result[key] = Object.assign(
              resultArray,
              { __element: undefined } // Generic typed array marker
            )
          }
        }
      }

      return result as SpecializedOutputType
    } catch (error) {
      console.error('Error calling AI function:', error)
      throw error
    }
  }
  
  // Add metadata to the function for TypeScript inference
  Object.defineProperty(typedFunction, '_schemaType', {
    value: schema,
    configurable: false,
    enumerable: false
  })
  
  return typedFunction
}

// AI factory function for creating strongly-typed functions

/**
 * The AI factory function that converts definition objects into functions
 * based on their schema, and preserves existing function callbacks.
 */
export const AI = <T extends Record<string, FunctionDefinition | FunctionCallback<any, any>>>(definition: T, config?: AIConfig) => {
  // Create the result object that will be returned
  const result = {} as any

  // Process each key in the definition object
  for (const key in definition) {
    const value = definition[key]
    
    if (typeof value === 'function') {
      // If it's already a function, keep it as-is
      result[key] = value
    } else {
      // For schema definitions, create a function that returns a Promise
      result[key] = createFunction(key as string, value as FunctionDefinition, config)
    }
  }

  // For any callbacks (functions), provide them with the AI context
  for (const key in definition) {
    if (typeof definition[key] === 'function') {
      // Create a proper AI context with access to all AI functions
      const aiContext = new Proxy({}, {
        get: (_target, prop) => {
          if (typeof prop === 'string' && prop in result) {
            return result[prop]
          }
          // Dynamic function creation for undefined functions
          return (...args: any[]) => {
            console.warn(`Function '${String(prop)}' was not defined`)
            return Promise.resolve({} as any)
          }
        }
      })
      
      // Wrap the callback function with AI context
      const originalFunction = result[key]
      result[key] = async (args: any) => {
        return await originalFunction({ ai: aiContext, args })
      }
    }
  }

  // Special handling for launchStartup callback if it exists
  if ('launchStartup' in result && typeof definition.launchStartup === 'function') {
    try {
      // Create a context for the startup callback
      const startupContext = new Proxy({}, {
        get: (_target, prop) => {
          if (typeof prop === 'string' && prop in result) {
            return result[prop]
          }
          return (...args: any[]) => {
            console.warn(`Function '${String(prop)}' was not defined`)
            return Promise.resolve({} as any)
          }
        }
      })
      
      // Execute the startup callback
      ;(result.launchStartup as Function)({ ai: startupContext, args: {} })
    } catch (error) {
      console.error('Error in launchStartup callback:', error)
    }
  }

  return result as any // Return with proper inference from the AIFactory type
}

// Dynamic ai instance that accepts any function name
// Make a specialized version of createFunction that better handles type inference for dynamic calls
const createDynamicFunction = <T extends SchemaValue>(name: string, config?: AIConfig) => {
  // Create an empty schema that will be filled dynamically by the server
  const emptySchema = {} as Record<string, T>

  return createFunction(name, emptySchema, config)
}

// Create a special proxy with improved type inference
export const ai = new Proxy(
  {},
  {
    get: (target: any, prop: string) => {
      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return createDynamicFunction(prop, {})
      }
      return target[prop]
    },
  },
) as AI_Instance
