import { describe, it, expect, vi } from 'vitest'
import { waitFor } from './waitFor'

describe('waitFor', () => {
  it('should resolve with the first N successful promises', async () => {
    // Create an array of promises that resolve with different values at different times
    const promises = [Promise.resolve('first'), Promise.resolve('second'), Promise.resolve('third'), Promise.resolve('fourth')]

    const results = await waitFor(promises, 2)

    // It should return the first 2 resolved values
    expect(results).toHaveLength(2)
    expect(results).toContain('first')
    expect(results).toContain('second')
  })

  it('should ignore rejected promises', async () => {
    // Create an array with some rejected promises
    const promises = [
      Promise.reject(new Error('Error 1')),
      Promise.resolve('success 1'),
      Promise.reject(new Error('Error 2')),
      Promise.resolve('success 2'),
      Promise.resolve('success 3'),
    ]

    const results = await waitFor(promises, 2)

    // It should skip the rejected promises and return the successful ones
    expect(results).toHaveLength(2)
    expect(results).toContain('success 1')
    expect(results).toContain('success 2')
  })

  it('should handle timeout scenarios with delayed promises', async () => {
    // Create promises that resolve after different delays
    const promises = [
      new Promise((resolve) => setTimeout(() => resolve('slow 1'), 100)),
      new Promise((resolve) => setTimeout(() => resolve('slow 2'), 200)),
      Promise.resolve('fast'),
    ]

    const results = await waitFor(promises, 3)

    // It should wait for all promises and return them all since count=3
    expect(results).toHaveLength(3)
    expect(results).toContain('fast')
    expect(results).toContain('slow 1')
    expect(results).toContain('slow 2')
  })

  it('should return fewer results if there are fewer successful promises than requested count', async () => {
    const promises = [Promise.resolve('success 1'), Promise.reject(new Error('Error')), Promise.resolve('success 2')]

    // Request more successful promises than will actually resolve
    const results = await waitFor(promises, 5)

    // It should return only the successful promises
    expect(results).toHaveLength(2)
    expect(results).toContain('success 1')
    expect(results).toContain('success 2')
  })

  it('should return results in the order they resolve, not in the input order', async () => {
    vi.useFakeTimers()

    // Create promises with different resolution times
    const promises = [new Promise((resolve) => setTimeout(() => resolve('slow'), 100)), Promise.resolve('fast')]

    // Start the async operation
    const resultPromise = waitFor(promises, 2)

    // Fast-forward time
    await vi.runAllTimersAsync()

    // Now check the results
    const results = await resultPromise

    // Should contain both values
    expect(results).toHaveLength(2)
    expect(results).toContain('fast')
    expect(results).toContain('slow')

    // Results should be in order of resolution
    expect(results[0]).toBe('fast')
    expect(results[1]).toBe('slow')

    vi.useRealTimers()
  })

  it('should handle empty promise array', async () => {
    const results = await waitFor([], 5)

    expect(results).toHaveLength(0)
  })

  it('should handle count of zero', async () => {
    const promises = [Promise.resolve('first'), Promise.resolve('second')]

    const results = await waitFor(promises, 0)

    expect(results).toHaveLength(0)
  })
})
