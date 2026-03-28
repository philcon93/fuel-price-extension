import { describe, it, expect } from 'vitest'
import Header from './Header'

describe('Header', () => {
  it('exports a component function', () => {
    expect(typeof Header).toBe('function')
  })
})
