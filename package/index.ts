import { AIConfig, AIFunction, FunctionDefinition, FunctionCallback, SchemaValue, AI_Instance, SchemaToOutput } from './types'

// Helper to ensure TypeScript correctly infers array element types
// This is critical for ensuring array elements have the correct type in map callbacks
type InferredArray<T> = T extends (infer U)[] ? U[] : never;

// Helper function that properly preserves array element types for map operations
const preserveArrayType = <T extends unknown[]>(arr: T): T => {
  return arr;
}

// Special helper for string arrays to ensure .map() operations have correct parameter types
const preserveStringArray = <T extends string[]>(arr: T): T => {
  // This cast ensures TypeScript preserves the string type for map operations
  return [...arr] as unknown as T;
}

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

      // Special type handling for listFunctions result
      if (name === 'listFunctions') {
        // Ensure we have a properly-typed result for the compiler
        const typedResult = { ...result } as { functions: unknown }
        
        // Convert to a proper string array with known element type
        let stringArray: string[] = []
        
        if (Array.isArray(typedResult.functions)) {
          // Map each element to ensure it's a string - this is key for type inference
          stringArray = (typedResult.functions as any[]).map(x => String(x))
        } else if (typedResult.functions) {
          stringArray = [String(typedResult.functions)]
        }
        
        // Return a new object with the properly-typed string array
        return {
          ...typedResult,
          functions: stringArray
        } as SpecializedOutputType
      }
      
      // Ensure schema shapes are preserved for TypeScript
      for (const key in schema) {
        // If schema defines an array property and result has that property
        if (Array.isArray(schema[key]) && result[key]) {
          // Determine what type of array we're working with
          const schemaArray = schema[key] as any[]
          if (schemaArray.length > 0 && typeof schemaArray[0] === 'string') {
            // For string arrays, ensure proper typing for .map() calls
            result[key] = preserveStringArray(Array.isArray(result[key]) ? result[key] : [result[key]])
          } else {
            // For other arrays, preserve type but don't specialize
            const array = Array.isArray(result[key]) ? result[key] : [result[key]]
            result[key] = preserveArrayType(array)
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

export const AI = <T extends Record<string, FunctionDefinition | FunctionCallback<any, any>>>(functions: T, config?: AIConfig) => {
  // Step 1: Separate schema definitions from callbacks with improved type inference
  type SchemaOnly = {
    [K in keyof T as T[K] extends FunctionDefinition ? K : never]: T[K] extends FunctionDefinition ? T[K] : never
  }
  
  // Define specific schema types for important functions to aid inference
  interface ListFunctionsSchema {
    workflow: string;
    persona: string;
    category: string;
    functions: string[];
  }
  
  interface DefineFunctionSchema {
    name: string;
    description: string;
  }
  
  // Create a strong type for the result object
  type Result = {
    [K in keyof T]: T[K] extends FunctionDefinition
      ? AIFunction<any, SchemaToOutput<T[K]>> & ((input: any, config?: AIConfig) => Promise<SchemaToOutput<T[K]>>)
      : T[K] extends FunctionCallback<infer TArgs, infer TSchema>
        ? FunctionCallback<TArgs, SchemaOnly>
        : never
  }

  // Create a type-safe result object
  const result = {} as Result
  
  // Helper to check if a value is a function
  const isFunction = (value: any): value is Function => {
    return typeof value === 'function'
  }
  
  // Extract schema definitions (non-function entries)
  const schemas: SchemaOnly = {} as SchemaOnly
  
  // Special handling for common function schemas to aid type inference
  if ('listFunctions' in functions && !isFunction(functions.listFunctions)) {
    (schemas as any).listFunctions = functions.listFunctions as FunctionDefinition;
  }
  
  if ('defineFunction' in functions && !isFunction(functions.defineFunction)) {
    (schemas as any).defineFunction = functions.defineFunction as FunctionDefinition;
  }
  
  const callbacks: Record<string, FunctionCallback<any, any>> = {}
  
  // Sort functions and schemas
  for (const [name, value] of Object.entries(functions)) {
    if (name !== 'listFunctions' && name !== 'defineFunction') {
      if (isFunction(value)) {
        callbacks[name] = value as FunctionCallback<any, any>
      } else {
        // @ts-ignore - We know this is safe because of our filter above
        schemas[name] = value as FunctionDefinition
      }
    } else if (isFunction(value)) {
      callbacks[name] = value as FunctionCallback<any, any>
    }
  }
  
  // Explicitly create functions from schemas for better type inference
  // Use a more precise type to maintain schema type information
  const schemaFunctions = {} as {
    [K in keyof SchemaOnly]: AIFunction<any, SchemaToOutput<SchemaOnly[K]>>
  }
  
  // Create properly typed functions from schemas
  for (const [name, schema] of Object.entries(schemas)) {
    // This cast is necessary but preserves the return type from schema
    const typedSchema = schema as FunctionDefinition;
    // Create the function with proper type inference
    const fn = createFunction(name, typedSchema, config);
    // Add to schema functions with the correct key type
    (schemaFunctions as any)[name] = fn;
  }
  
  // Create a properly typed ai instance for callbacks that preserves schema type information
  const aiInstance = new Proxy({
    ...schemaFunctions
  }, {
    get(target: Record<string, any>, prop: string) {
      if (prop in target) {
        return target[prop]
      }
      
      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return createFunction(prop, {}, config)
      }
      
      return undefined
    }
  // Use a simpler cast to avoid complex type errors
  }) as any

  // Process callbacks and add schema functions to result object
  for (const [name, callback] of Object.entries(callbacks)) {
    // Type this more carefully to ensure proper type inference
    result[name as keyof T] = callback as any
    
    // Immediately invoke startup callbacks
    if (name === 'launchStartup') {
      try {
        // Type this callback for the correct schema
        ;(callback as any)({ ai: aiInstance, args: {} })
      } catch (error) {
        console.error('Error in launchStartup callback:', error)
      }
    }
  }
  
  // Add schema functions to result with better type preservation
  for (const [name, fn] of Object.entries(schemaFunctions)) {
    // This preserves the return type from the schema
    result[name as keyof T] = fn as any
  }

  return result
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
