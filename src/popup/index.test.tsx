// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'

describe('popup/index', () => {
  it('imports App without throwing', async () => {
    const mod = await import('./App')
    expect(mod.default).toBeDefined()
    expect(typeof mod.default).toBe('function')
  })
})
