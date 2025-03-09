import { AIConfig, AIFunction, FunctionDefinition, SchemaValue } from './types'

// Helper to generate the API request payload
const generateRequest = (functionName: string, schema: FunctionDefinition, input: any, config: AIConfig) => {
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
      Authorization: `users API-Key ${process.env.FUNCTIONS_DO_API_KEY}`,
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    console.log(response.status, response.statusText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = await response.json() as any
  console.log(data)
  return data
}

// Helper to generate a function from schema and config
const createFunction = (
  name: string,
  schema: FunctionDefinition,
  config?: AIConfig
): AIFunction => {
  return async (input: any, functionConfig?: AIConfig) => {
    const mergedConfig = { ...config, ...functionConfig }
    const request = generateRequest(name, schema, input, mergedConfig)
    
    try {
      const response = await callAPI(request) as any
      return response.data ?? response
    } catch (error) {
      console.error('Error calling AI function:', error)
      throw error
    }
  }
}

// AI factory function for creating strongly-typed functions
export const AI = <T extends Record<string, FunctionDefinition>>(
  functions: T,
  config?: AIConfig
) => {
  const result: Record<string, AIFunction> = {}

  for (const [name, schema] of Object.entries(functions)) {
    result[name] = createFunction(name, schema, config)
  }

  return result as {
    [K in keyof T]: AIFunction<any, any>
  }
}

// Dynamic ai instance that accepts any function name
export const ai = new Proxy(
  {},
  {
    get: (target: any, prop: string) => {
      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return createFunction(prop, {}, {})
      }
      return target[prop]
    },
  }
) as any