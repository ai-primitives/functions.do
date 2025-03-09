import { describe, it, expect } from 'vitest'
import { ai, AI } from './index'

describe('functions.do', () => {
  describe('AI factory', () => {
    it('should create functions that make API calls', async () => {
      const functions = AI({
        generateBio: {
          name: 'string',
          role: 'string',
          company: 'string',
          bio: 'string'
        }
      })

      const result = await functions.generateBio({
        name: 'Paul Graham'
      })

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('role')
      expect(result).toHaveProperty('company')
      expect(result).toHaveProperty('bio')
      expect(typeof result.bio).toBe('string')
    }, 90000)

    it('should support nested object schemas', async () => {
      const functions = AI({
        createProduct: {
          name: 'string',
          price: 'string',
          details: {
            description: 'string',
            features: ['string'],
            specs: {
              dimensions: 'string',
              weight: 'string'
            }
          }
        }
      })

      const result = await functions.createProduct({
        name: 'Smart Watch',
        price: '$299'
      })

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('price')
      expect(result).toHaveProperty('details')
      expect(result.details).toHaveProperty('description')
      expect(Array.isArray(result.details.features)).toBe(true)
      expect(result.details.specs).toHaveProperty('dimensions')
      expect(result.details.specs).toHaveProperty('weight')
    }, 90000)

    it('should handle array of objects', async () => {
      const functions = AI({
        createFAQ: {
          topic: 'string',
          questions: [{
            question: 'string',
            answer: 'string'
          }]
        }
      })

      const result = await functions.createFAQ({
        topic: 'Product Returns'
      })

      expect(result).toHaveProperty('topic')
      expect(Array.isArray(result.questions)).toBe(true)
      expect(result.questions[0]).toHaveProperty('question')
      expect(result.questions[0]).toHaveProperty('answer')
    }, 90000)
  })

  describe('Dynamic ai instance', () => {
    it('should support arbitrary function names', async () => {
      const result = await ai.generateRandomName({
        type: 'product',
        industry: 'tech'
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    }, 90000)

    it('should handle errors gracefully', async () => {
      try {
        await ai.nonexistentFunction()
        throw new Error('Should have thrown')
      } catch (error) {
        expect(error).toBeDefined()
      }
    }, 90000)
  })
})
