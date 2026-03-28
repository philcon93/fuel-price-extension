// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import Home from './Home'

describe('Home', () => {
  it('exports a component function', () => {
    expect(typeof Home).toBe('function')
  })
})
