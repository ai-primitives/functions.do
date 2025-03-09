import { describe, it, expect } from 'vitest';
import generateObject from './generateObject';
import { FunctionDefinition } from '@/package/types';



// Set a longer timeout for these tests since they make actual API calls
const TEST_TIMEOUT = 30000;

// Tests that make actual API calls to verify the functionality
describe('generateObject', () => {
  // Test with a simple schema
  it('should generate an object based on a simple schema', async () => {
    // Define a simple person schema
    const personSchema: FunctionDefinition = {
      name: 'A string containing a person\'s full name',
      age: 'A number representing the person\'s age in years',
      companies: ['The name of companies they have worked at'],
      email: 'A guessed email (use the most recent company domain)'
    }

    const result = await generateObject({
      functionName: 'getPerson',
      input: { twitter: 'sama' },
      schema: personSchema,
      // Using a specific model to reduce variability in tests
      // model: 'openai/gpt-4o-mini',
      settings: {
        temperature: 0, // Use temperature 0 for more deterministic results
      }
    });

    // Check that the result has the expected structure
    expect(result.object).toBeDefined();
    expect(typeof result.object.name).toBe('string');
    expect(typeof result.object.age).toBe('string');
    expect(typeof result.object.email).toBe('string');
    expect(result.object.email).toMatch(/@/);
  }, TEST_TIMEOUT);

  // Test with a more complex nested schema
  it('should generate an object based on a complex nested schema', async () => {
    // Define a complex schema with nested objects
    const orderSchema: FunctionDefinition = {
      orderId: 'A unique order identifier string',
      customer: {
        name: 'Customer full name',
        email: 'Customer email address',
        address: {
          street: 'Street address',
          city: 'City name',
          state: 'State or province code',
          zip: 'Postal code'
        }
      },
      items: [
        {
          productId: 'Product identifier',
          name: 'Product name',
          price: 'Product price in USD',
          quantity: 'Quantity ordered'
        }
      ],
      total: 'Order total in USD',
      orderDate: 'Order date in ISO format'
    };

    const result = await generateObject({
      functionName: 'getOrder',
      input: { product: 'xbox'},
      schema: orderSchema,
      // model: 'openai/gpt-4o-mini',
      settings: {
        temperature: 0,
      }
    });

    // Check the structure of the result
    expect(result.object).toBeDefined();
    expect(typeof result.object.orderId).toBe('string');
    expect(result.object.customer).toBeDefined();
    expect(typeof result.object.customer.name).toBe('string');
    expect(typeof result.object.customer.email).toBe('string');
    expect(result.object.customer.address).toBeDefined();
    expect(Array.isArray(result.object.items)).toBe(true);
    expect(result.object.items.length).toBeGreaterThan(0);
    expect(typeof result.object.total).toBe('string');
    expect(typeof result.object.orderDate).toBe('string');
  }, TEST_TIMEOUT);

  // Test without providing a schema (using 'no-schema' mode)
  it('should generate content without a schema', async () => {
    const result = await generateObject({
      functionName: 'generateCreativeText',
      input: {
        topic: 'space exploration'
      },
      // model: 'openai/gpt-4o-mini',
      settings: {
        prompt: 'Write a short paragraph about space exploration.'
      }
    });

    // Basic check that we got something back
    expect(result.object).toBeDefined();
  }, TEST_TIMEOUT);

  // Test with enum values in the schema
  it('should handle enum values in the schema', async () => {
    const productSchema: FunctionDefinition = {
      name: 'Product name',
      category: 'electronics | clothing | books | home',
      inStock: 'true | false',
      rating: 'A number from 1 to 5 representing customer rating'
    };

    const result = await generateObject({
      functionName: 'getProduct',
      input: { product: 'Xbox' },
      schema: productSchema,
      // model: 'openai/gpt-4o-mini',
      settings: {
        temperature: 0,
      }
    });

    // Check that enum values are respected
    expect(result.object).toBeDefined();
    expect(['electronics', 'clothing', 'books', 'home']).toContain(result.object.category);
    expect(['true', 'false']).toContain(result.object.inStock);
  }, TEST_TIMEOUT);


  it('should support calls without a schema', async () => {
    const result = await generateObject({
      functionName: 'writeBlogPost',
      input: {
        topic: 'space exploration'
      },
      // model: 'openai/gpt-4o-mini',
    });

    // Basic check that we got something back
    expect(result.object).toBeDefined();
  }, TEST_TIMEOUT);


  it('should support calls without a schema', async () => {
    const result = await generateObject({
      functionName: 'generateStoryBrand',
      input: {
        business: 'AWS'
      },

    });

    // Basic check that we got something back
    expect(result.object).toBeDefined();
  }, TEST_TIMEOUT);


  it('return reasoning', async () => {
    const result = await generateObject({
      functionName: 'determineGreaterValue',
      model: 'deepseek/deepseek-r1',
      input: {
        values: '4.11 vs 4.9'
      },

    })
    // Basic check that we got something back
    expect(result).toBeDefined();
  }, TEST_TIMEOUT);

  it('return reasoning', async () => {
    const result = await generateObject({
      functionName: 'determineGreaterValue',
      model: 'anthropic/claude-3.7-sonnet:thinking',
      input: {
        values: '4.11 vs 4.9'
      },

    })
    // Basic check that we got something back
    expect(result.object).toBeDefined();
  }, TEST_TIMEOUT);

});
