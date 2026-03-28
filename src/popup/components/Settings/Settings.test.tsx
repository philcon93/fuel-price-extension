// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import Settings from './Settings'

describe('Settings', () => {
  it('exports a component function', () => {
    expect(typeof Settings).toBe('function')
  })
})
