import { describe, it, expect } from 'vitest'

describe('popup/index', () => {
  it('imports App without throwing', async () => {
    const mod = await import('./App')
    expect(mod.App).toBeDefined()
    expect(typeof mod.App).toBe('function')
  })
})
