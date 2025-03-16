import { describe, it, expect } from 'vitest'
import ai from './createFunctions'

describe('createFunctions', () => {
  it('should create functions', async () => {
    const result = await ai.listFunctions({ company: 'startup', activity: 'cold outbound' })
    expect(result.functions).toBeDefined()
  })
})