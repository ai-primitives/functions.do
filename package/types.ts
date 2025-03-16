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

export type SchemaValue = string | string[] | { [key: string]: SchemaValue } | SchemaValue[]

export type FunctionDefinition = Record<string, SchemaValue>

// StringArray is defined above

/**
 * Helper type for strongly-typed arrays with preserved element types
 */
export type TypedArray<T> = Array<T> & { __element?: T };

// Helper type to convert schema to output type with stronger array element type preservation
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
export type FunctionCallback<TArgs = any, TSchemas = Record<string, FunctionDefinition>> = (
  context: { 
    ai: {
      [K in keyof TSchemas]: TSchemas[K] extends FunctionDefinition 
        ? ((input: any, config?: AIConfig) => Promise<SchemaToOutput<TSchemas[K]>>) & 
          AIFunction<any, SchemaToOutput<TSchemas[K]>>
        : never
    } & { 
      // Index signature to allow any function name access
      [key: string]: (input?: any, config?: AIConfig) => Promise<any> 
    }; 
    args: TArgs 
  }
) => any | Promise<any>

// StringArray is defined above

/**
 * Utility function to create a StringArray from any input
 * This ensures TypeScript can properly infer element types during map operations
 */
export function createStringArray(input: unknown[] | string | undefined): StringArray {
  let result: string[];
  
  // Handle array input
  if (Array.isArray(input)) {
    result = input.map(item => String(item));
  }
  // Handle single value
  else if (input !== undefined) {
    result = [String(input)];
  }
  // Handle empty case
  else {
    result = [];
  }
  
  // Add the brand property to make it a proper StringArray
  return Object.assign(result, { __brand: 'StringArray' as const });
}

/**
 * Represents the return value from the listFunctions call
 * with strong typing for the functions array.
 */
export interface ListFunctionsResult {
  // Explicitly define functions as a StringArray to ensure proper element type inference
  functions: StringArray;
  // Allow any other properties to be returned
  [key: string]: any;
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
};

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
