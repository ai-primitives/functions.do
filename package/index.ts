// Define the possible field types in a schema
export type AISchemaFieldPrimitive = string | string[] | Record<string, any> | Record<string, any>[]
export interface AISchemaObject {
  [key: string]: AISchemaField
}
export type AISchemaField = AISchemaFieldPrimitive | AISchemaObject
export type AISchema = Record<string, AISchemaField>

export type AIConfig = Record<string, AISchema>
export type AIFunctions<T extends AIConfig> = {
  [key in keyof T]: (args: any) => Promise<T[key]>
}

// Create a global schema store to hold schemas defined with the define pattern
const schemaStore: Record<string, AISchema> = {};


// Type definitions for the ai object with define method and dynamic properties
// Define the structure of the ai object to support both define and dynamic function calls
interface AIDefineProxy {
  [key: string]: (schema: AISchema) => AISchema;
}

interface AIDynamicFunctions {
  [key: string]: (args: any) => Promise<any>;
}

// The main AI object type that combines both the define property and dynamic functions
// Use an intersection type instead of extending to avoid the index signature conflict
type AIObject = {
  define: AIDefineProxy;
} & Omit<AIDynamicFunctions, 'define'>;

// Create the ai object with both define capability and dynamic function access
export const ai: AIObject = new Proxy({} as any, {
  get: (target, prop: string) => {
    // Handle the 'define' property specially
    if (prop === 'define') {
      // If the define property doesn't exist yet, create it
      if (!target.define) {
        target.define = new Proxy({} as AIDefineProxy, {
          get: (_defineTarget, defineProp: string) => {
            // Return a function that accepts a schema and stores it for later use
            return (schema: AISchema) => {
              schemaStore[defineProp] = schema;
              return schema;
            };
          }
        });
      }
      return target.define;
    }
    
    // For any other property, return a function that handles the AI API call
    return async (args: any) => {
      try {
        // Get the API endpoint from environment variables
        const API_ENDPOINT = process?.env?.AI_API_ENDPOINT || 'https://functions.do/api';
        
        // Check if we have a schema for this function
        if (!schemaStore[prop]) {
          throw new Error(`Schema for AI function '${String(prop)}' not defined. Use ai.define.${String(prop)}({...}) first.`);
        }
        
        // Prepare the request payload
        const payload = {
          function: prop,
          args,
          schema: schemaStore[prop]
        };
        
        // Make the API request
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process?.env?.AI_API_KEY || ''}`
          },
          body: JSON.stringify(payload)
        });
        
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`AI API request failed: ${response.statusText}`);
        }
        
        // Parse and return the response
        const result = await response.json();
        return result;
      } catch (error) {
        console.error(`Error in AI function '${String(prop)}':`, error);
        throw error;
      }
    };
  }
});

// TODO: Integrate this more conventional interface
// type AIFunction = <T>(schema: T) => (args: object) => Promise<T>

/**
 * Creates an AI function proxy that captures function calls,
 * sends them to an API endpoint defined in environment variables,
 * and returns the typed response.
 */
export const AI = <T extends AIConfig>(config: T): AIFunctions<T> => {
  // Get the API endpoint from environment variables
  const API_ENDPOINT = process?.env?.AI_API_ENDPOINT || 'https://functions.do/api';
  
  // Create a proxy handler to intercept function calls
  const handler: ProxyHandler<any> = {
    get: (target, prop: string) => {
      // Return a function that will be called when the property is accessed
      return async (args: any) => {
        try {
          // Prepare the request payload
          const payload = {
            function: prop,
            args,
            schema: config[prop]
          };
          
          // Make the API request
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process?.env?.AI_API_KEY || ''}`
            },
            body: JSON.stringify(payload)
          });
          
          // Check if the request was successful
          if (!response.ok) {
            throw new Error(`AI API request failed: ${response.statusText}`);
          }
          
          // Parse and return the response
          const result = await response.json();
          return result as T[typeof prop];
        } catch (error) {
          console.error(`Error in AI function '${String(prop)}':`, error);
          throw error;
        }
      };
    }
  };
  
  // Create and return the proxy
  return new Proxy({}, handler) as AIFunctions<T>;
}
