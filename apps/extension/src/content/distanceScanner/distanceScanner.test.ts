import { describe, it, expect } from 'vitest'
import { extractDistance } from '.'

describe('extractDistance', () => {
  it('parses km distance', () => {
    expect(extractDistance('25.3 km')).toEqual({ value: 25.3, unit: 'km' })
  })

  it('parses km with non-breaking space', () => {
    expect(extractDistance('25.3\u00A0km')).toEqual({ value: 25.3, unit: 'km' })
  })

  it('parses miles distance', () => {
    expect(extractDistance('15 mi')).toEqual({ value: 15, unit: 'miles' })
  })

  it('parses "miles" variant', () => {
    expect(extractDistance('15 miles')).toEqual({ value: 15, unit: 'miles' })
  })

  it('parses distance with comma separator', () => {
    expect(extractDistance('1,234 km')).toEqual({ value: 1234, unit: 'km' })
  })

  it('returns null for non-distance text', () => {
    expect(extractDistance('via Hume Hwy')).toBeNull()
  })

  it('returns null for time-like text', () => {
    expect(extractDistance('2 hr 15 min')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractDistance('')).toBeNull()
  })

  it('handles leading/trailing whitespace', () => {
    expect(extractDistance('  5.4 km  ')).toEqual({ value: 5.4, unit: 'km' })
  })
})
