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
// Define StringArray as an array of string literals to help TypeScript better infer element types
export type StringArray = Array<string>

export type SchemaValue = string | StringArray | { [key: string]: SchemaValue } | SchemaValue[]

export type FunctionDefinition = Record<string, SchemaValue>

// Helper type to convert schema to output type
export type SchemaToOutput<T extends FunctionDefinition> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? (U extends string
      ? StringArray // Use StringArray to ensure map() operations understand element type is string
      : U extends Record<string, any>
        ? Array<{ [P in keyof U]: SchemaToOutput<{ value: U[P] }>['value'] }>
        : Array<string>)
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

// Main AI function factory type
export type AI = {
  <T extends Record<string, FunctionDefinition | FunctionCallback<any, any>>>(
    functions: T,
    config?: AIConfig,
  ): {
    [K in keyof T]: T[K] extends FunctionDefinition 
      ? AIFunction<any, SchemaToOutput<T[K]>> 
      : T[K] extends FunctionCallback<infer TArgs, any> 
        ? FunctionCallback<TArgs, Extract<T, Record<string, FunctionDefinition>>> 
        : never
  }
}

// Dynamic AI instance type
export type AI_Instance = {
  [K: string]: (input?: any, config?: AIConfig) => Promise<any>
}

// Helper type to infer array element types
export type ArrayElementType<T> = T extends (infer U)[] ? U : never
