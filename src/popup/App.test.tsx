// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('exports a component function', () => {
    expect(typeof App).toBe('function')
  })
})
