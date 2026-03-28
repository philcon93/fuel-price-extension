import { describe, it, expect } from 'vitest'
import { themeClass, vars } from './theme.css'

describe('theme.css', () => {
  it('exports a themeClass string', () => {
    expect(themeClass).toBeDefined()
    expect(typeof themeClass).toBe('string')
  })

  it('exports surface color tokens', () => {
    expect(vars.color.surface).toBeDefined()
    expect(vars.color.surfaceContainerLow).toBeDefined()
    expect(vars.color.surfaceContainerHigh).toBeDefined()
    expect(vars.color.surfaceContainerHighest).toBeDefined()
  })

  it('exports primary color tokens', () => {
    expect(vars.color.primary).toBeDefined()
    expect(vars.color.primaryDim).toBeDefined()
    expect(vars.color.onPrimary).toBeDefined()
  })

  it('exports secondary and tertiary color tokens', () => {
    expect(vars.color.secondary).toBeDefined()
    expect(vars.color.tertiary).toBeDefined()
    expect(vars.color.error).toBeDefined()
  })

  it('exports text color tokens', () => {
    expect(vars.color.onSurface).toBeDefined()
    expect(vars.color.onSurfaceVariant).toBeDefined()
    expect(vars.color.outlineVariant).toBeDefined()
  })

  it('exports spacing tokens', () => {
    expect(vars.space.xs).toBeDefined()
    expect(vars.space.sm).toBeDefined()
    expect(vars.space.md).toBeDefined()
    expect(vars.space.lg).toBeDefined()
    expect(vars.space.xl).toBeDefined()
    expect(vars.space.xxl).toBeDefined()
  })

  it('exports font tokens including families', () => {
    expect(vars.font.sm).toBeDefined()
    expect(vars.font.base).toBeDefined()
    expect(vars.font.lg).toBeDefined()
    expect(vars.font.headline).toBeDefined()
    expect(vars.font.body).toBeDefined()
    expect(vars.font.label).toBeDefined()
  })

  it('exports radius tokens', () => {
    expect(vars.radius.sm).toBeDefined()
    expect(vars.radius.md).toBeDefined()
    expect(vars.radius.lg).toBeDefined()
    expect(vars.radius.full).toBeDefined()
  })
})
