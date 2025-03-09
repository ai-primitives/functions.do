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
  (input: TInput, config?: AIConfig): Promise<TOutput>
}

// Types for function definitions
export type SchemaValue =
  | string
  | string[]
  | { [key: string]: SchemaValue }
  | SchemaValue[]

export type FunctionDefinition = Record<string, SchemaValue>

// Helper type to convert schema to output type
type SchemaToOutput<T extends FunctionDefinition> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? U extends Record<string, any>
      ? Array<{ [P in keyof U]: SchemaToOutput<{ value: U[P] }>['value'] }>
      : string[]
    : T[K] extends Record<string, any>
    ? { [P in keyof T[K]]: SchemaToOutput<{ value: T[K][P] }>['value'] }
    : string
}

// Main AI function factory type
export type AI = {
  <T extends Record<string, FunctionDefinition>>(
    functions: T,
    config?: AIConfig
  ): {
    [K in keyof T]: AIFunction<any, SchemaToOutput<T[K]>>
  }
}

// Dynamic AI instance type
export type AI_Instance = {
  [K: string]: AIFunction
}