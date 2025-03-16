export type ModelName = string

export interface AIConfig {
  model?: ModelName
  system?: string
  temperature?: number
  seed?: number
  schema?: Record<string, any>
}

// Generic AI function type
export type AIFunction<TInput = any, TOutput = any> = {
  (input?: TInput, config?: AIConfig): Promise<TOutput>
}

// Types for function definitions
/**
 * StringArray is a branded type to help TypeScript properly infer element types
 * This helps ensure strong typing during map operations
 */
export type StringArray = Array<string> & { __brand: 'StringArray' }

export type SchemaValue =
  | string
  | string[]
  | { [key: string]: SchemaValue }
  | SchemaValue[]

export type FunctionDefinition = Record<string, SchemaValue>

/**
 * Helper type for strongly-typed arrays with preserved element types
 */
export type TypedArray<T> = Array<T> & { __element?: T }

/**
 * Helper to convert schema to output type with stronger array element type preservation
 */
export type SchemaToOutput<T extends FunctionDefinition> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? (U extends string
      ? StringArray // Ensure string array has proper element type for map operations
      : U extends Record<string, any>
        ? TypedArray<{ [P in keyof U]: SchemaToOutput<{ value: U[P] }>['value'] }>
        : TypedArray<string>)
    : T[K] extends Record<string, any>
      ? { [P in keyof T[K]]: SchemaToOutput<{ value: T[K][P] }>['value'] }
      : string
}

// Improved function callback type with better type preservation for arrays
export type FunctionCallback<
  TArgs = any,
  TSchemas = Record<string, FunctionDefinition>
> = (
  context: {
    ai: {
      [K in keyof TSchemas]: TSchemas[K] extends FunctionDefinition
        ? ((input: any, config?: AIConfig) => Promise<SchemaToOutput<TSchemas[K]>>) &
          AIFunction<any, SchemaToOutput<TSchemas[K]>>
        : never
    } & {
      // Index signature to allow any function name access
      [key: string]: (input?: any, config?: AIConfig) => Promise<any>
    }
    args: TArgs
  }
) => any | Promise<any>

/**
 * Utility function to create a StringArray from any input
 * This ensures TypeScript can properly infer element types during map operations
 */
export function createStringArray(input: unknown[] | string | undefined): StringArray {
  let result: string[]

  // Handle array input
  if (Array.isArray(input)) {
    result = input.map((item) => String(item))
  }
  // Handle single value
  else if (input !== undefined) {
    result = [String(input)]
  }
  // Handle empty case
  else {
    result = []
  }

  // Add the brand property to make it a proper StringArray
  return Object.assign(result, { __brand: 'StringArray' as const })
}

/**
 * Represents the return value from the listFunctions call
 * with strong typing for the functions array.
 */
export interface ListFunctionsResult {
  // Explicitly define functions as a StringArray to ensure proper element type inference
  functions: StringArray
  // Allow any other properties to be returned
  [key: string]: any
}

/**
 * The AI type:
 *  - If a property is a function, keep it as-is.
 *  - Otherwise, transform it into a function with the same shape for both input and output.
 *  - Special case for listFunctions to ensure functions array has string[] type
 */
export type AI<T extends Record<string, any>> = {
  [K in keyof T]: K extends 'listFunctions'
    ? (args: any) => Promise<ListFunctionsResult> // Special handling for listFunctions
    : T[K] extends (...args: any[]) => any
    ? T[K] // Keep existing functions
    : (args: T[K]) => Promise<SchemaToOutput<T[K] & FunctionDefinition>> // Convert schema objects to functions
}

/**
 * AI function factory type for the exported function
 */
export type AIFactory = {
  <T extends Record<string, FunctionDefinition | FunctionCallback<any, any>>>(
    definition: T,
    config?: AIConfig
  ): AI<T>
}

// Dynamic AI instance type
export type AI_Instance = {
  [K: string]: (input?: any, config?: AIConfig) => Promise<any>
}

// Helper type to infer array element types
export type ArrayElementType<T> = T extends (infer U)[] ? U : never

// Helper to generate the API request payload
const generateRequest = (
  functionName: string,
  schema: FunctionDefinition,
  input: any,
  config: AIConfig
) => {
  return {
    functionName,
    schema,
    input,
    config
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
      Authorization: `users API-Key ${process.env.FUNCTIONS_DO_API_KEY}`
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    console.log(response.status, response.statusText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = (await response.json()) as any
  console.log(data)
  return data
}

// Define a more precise type for schema objects with a `functions` array
interface WithFunctionsArray {
  functions: string[]
}

/**
 * Creates a strongly-typed function from a schema and config.
 */
const createFunction = <T extends FunctionDefinition>(
  name: string,
  schema: T,
  config?: AIConfig
) => {
  type OutputType = SchemaToOutput<T>

  // For the special case of `listFunctions`, ensure `functions` is typed properly
  type SpecializedOutputType = T extends { functions: any[] }
    ? OutputType & WithFunctionsArray
    : OutputType

  const typedFunction = async (
    input: any,
    functionConfig?: AIConfig
  ): Promise<SpecializedOutputType> => {
    const mergedConfig = { ...config, ...functionConfig }
    const request = generateRequest(name, schema, input, mergedConfig)

    try {
      const response = (await callAPI(request)) as any
      const result = response.data ?? response

      // Special handling for listFunctions
      if (name === 'listFunctions') {
        const typedResult = { ...result }
        typedResult.functions = createStringArray(typedResult.functions)
        return typedResult as SpecializedOutputType
      }

      // Ensure arrays in the result are typed properly
      for (const key in schema) {
        if (Array.isArray(schema[key]) && result[key]) {
          const resultArray = Array.isArray(result[key]) ? result[key] : [result[key]]
          const schemaArray = schema[key] as any[]

          if (schemaArray.length > 0 && typeof schemaArray[0] === 'string') {
            // For string arrays, ensure proper typing for map operations
            result[key] = Object.assign(
              resultArray.map((item: any) =>
                typeof item === 'string' ? item : String(item)
              ),
              { __element: '' } // helps TypeScript infer a string element type
            )
          } else {
            // For other arrays, ensure they're tagged with TypedArray marker
            result[key] = Object.assign(resultArray, {
              __element: undefined
            })
          }
        }
      }

      return result as SpecializedOutputType
    } catch (error) {
      console.error('Error calling AI function:', error)
      throw error
    }
  }

  Object.defineProperty(typedFunction, '_schemaType', {
    value: schema,
    configurable: false,
    enumerable: false
  })

  return typedFunction
}

/**
 * The AI factory function that converts definition objects into functions
 * based on their schema, and preserves existing function callbacks.
 */
export const AI = <
  T extends Record<string, FunctionDefinition | FunctionCallback<any, any>>
>(
  definition: T,
  config?: AIConfig
): AI<T> => {
  const result: Partial<AI<T>> = {}

  // First pass: set up either a typed function (schema) or keep the callback
  for (const key in definition) {
    const value = definition[key]

    if (typeof value === 'function') {
      // Temporarily store the callback; we will wrap it with AI context below
      result[key] = value as any
    } else {
      // Create a strongly-typed function from the schema
      result[key] = createFunction(key, value, config) as any
    }
  }

  // Second pass: wrap the callbacks with AI context
  for (const key in definition) {
    if (typeof definition[key] === 'function') {
      const originalFunction = definition[key] as FunctionCallback
      result[key] = (async (args: any) => {
        // Provide a dynamic AI context that has access to *all* keys
        const aiContext = new Proxy(
          {},
          {
            get: (_target, prop: PropertyKey) => {
              // If we have a typed function in `result`, return it
              if (typeof prop === 'string' && result[prop]) {
                return result[prop]
              }
              // Otherwise, return a dummy function
              return () => {
                console.warn(`Function '${String(prop)}' was not defined`)
                return Promise.resolve({})
              }
            }
          }
        )

        return await originalFunction({
          ai: aiContext as any,
          args
        })
      }) as any
    }
  }

  // Return the resulting AI object with proper type inference
  return result as AI<T>
}

// Helper function for creating "dynamic" calls with an empty schema
const createDynamicFunction = (name: string, config?: AIConfig) => {
  const emptySchema: FunctionDefinition = {}
  return createFunction(name, emptySchema, config)
}

/**
 * A special proxy that allows calling any function name dynamically.
 * Fixes the TS7006 warning by typing the `prop` as `PropertyKey`.
 */
export const ai = new Proxy<AI_Instance>({} as AI_Instance, {
  get: (_target: AI_Instance, prop: PropertyKey) => {
    // We only handle string keys here
    if (typeof prop === 'string') {
      return createDynamicFunction(prop, {})
    }
    // Fallback (symbol or number) - return a no-op function
    return () => Promise.resolve({})
  }
})