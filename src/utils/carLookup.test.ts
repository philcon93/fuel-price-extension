import { describe, it, expect } from 'vitest'
import { parseQuery } from './carLookup'

describe('parseQuery', () => {
  it('parses make only', () => {
    const result = parseQuery('toyota')
    expect(result.make).toBe('toyota')
    expect(result.model).toBeUndefined()
    expect(result.year).toBeUndefined()
  })

  it('parses make and model', () => {
    const result = parseQuery('toyota corolla')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
  })

  it('parses make, model, and year', () => {
    const result = parseQuery('toyota corolla 2023')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
    expect(result.year).toBe(2023)
  })

  it('extracts fuel type keywords', () => {
    const result = parseQuery('toyota corolla 2023 hybrid')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
    expect(result.year).toBe(2023)
    expect(result.keywords).toContain('hybrid')
  })

  it('handles year before model', () => {
    const result = parseQuery('toyota 2023 corolla')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
    expect(result.year).toBe(2023)
  })

  it('handles diesel keyword', () => {
    const result = parseQuery('ford ranger diesel')
    expect(result.keywords).toContain('diesel')
  })

  it('handles empty input', () => {
    const result = parseQuery('')
    expect(result.make).toBeUndefined()
    expect(result.model).toBeUndefined()
    expect(result.year).toBeUndefined()
    expect(result.keywords).toEqual([])
  })

  it('handles extra whitespace', () => {
    const result = parseQuery('  honda   civic  ')
    expect(result.make).toBe('honda')
    expect(result.model).toBe('civic')
  })
})
