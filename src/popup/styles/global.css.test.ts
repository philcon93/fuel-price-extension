import { describe, it, expect } from 'vitest'

describe('global.css', () => {
  it('imports without errors', async () => {
    const mod = await import('./global.css')
    expect(mod).toBeDefined()
  })
})
