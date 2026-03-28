import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import { substitute, I18nProvider, useI18n, getBrowserLocale } from './i18n.jsx'

describe('substitute', () => {
  it('replaces a single placeholder', () => {
    expect(substitute('{{count}} More', { count: '3' })).toBe('3 More')
  })

  it('replaces multiple placeholders', () => {
    expect(substitute('{{a}} and {{b}}', { a: 'X', b: 'Y' })).toBe('X and Y')
  })

  it('preserves unknown placeholders', () => {
    expect(substitute('Hello {{name}}', {})).toBe('Hello {{name}}')
  })

  it('returns template unchanged when no placeholders exist', () => {
    expect(substitute('No placeholders here', { key: 'val' })).toBe('No placeholders here')
  })

  it('handles empty vars', () => {
    expect(substitute('{{x}}', { x: '' })).toBe('')
  })
})

describe('getBrowserLocale', () => {
  it('returns the base language code', () => {
    vi.stubGlobal('navigator', { language: 'en-US' })
    expect(getBrowserLocale()).toBe('en')
    vi.unstubAllGlobals()
  })

  it('handles simple locale', () => {
    vi.stubGlobal('navigator', { language: 'fr' })
    expect(getBrowserLocale()).toBe('fr')
    vi.unstubAllGlobals()
  })
})

describe('I18nProvider + useI18n', () => {
  it('provides translations to child components', () => {
    function TestChild() {
      const i18n = useI18n()
      return <span>{i18n['Loading...']}</span>
    }

    render(() => (
      <I18nProvider>
        <TestChild />
      </I18nProvider>
    ))

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('falls back to English for unknown locale', () => {
    vi.stubGlobal('navigator', { language: 'xx-XX' })

    function TestChild() {
      const i18n = useI18n()
      return <span>{i18n['Dashboard']}</span>
    }

    render(() => (
      <I18nProvider>
        <TestChild />
      </I18nProvider>
    ))

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})
