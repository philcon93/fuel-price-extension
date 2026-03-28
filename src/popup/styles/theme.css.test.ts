import { describe, it, expect } from 'vitest'
import { themeClass, vars } from './theme.css'

describe('theme.css', () => {
  it('exports a themeClass string', () => {
    expect(themeClass).toBeDefined()
    expect(typeof themeClass).toBe('string')
  })

  it('exports color tokens', () => {
    expect(vars.color.bg).toBeDefined()
    expect(vars.color.text).toBeDefined()
    expect(vars.color.accent).toBeDefined()
    expect(vars.color.danger).toBeDefined()
    expect(vars.color.success).toBeDefined()
    expect(vars.color.border).toBeDefined()
    expect(vars.color.surface).toBeDefined()
    expect(vars.color.textMuted).toBeDefined()
    expect(vars.color.accentHover).toBeDefined()
  })

  it('exports spacing tokens', () => {
    expect(vars.space.xs).toBeDefined()
    expect(vars.space.sm).toBeDefined()
    expect(vars.space.md).toBeDefined()
    expect(vars.space.lg).toBeDefined()
  })

  it('exports font tokens', () => {
    expect(vars.font.sm).toBeDefined()
    expect(vars.font.base).toBeDefined()
    expect(vars.font.lg).toBeDefined()
    expect(vars.font.family).toBeDefined()
  })

  it('exports radius tokens', () => {
    expect(vars.radius.sm).toBeDefined()
    expect(vars.radius.md).toBeDefined()
    expect(vars.radius.full).toBeDefined()
  })
})
