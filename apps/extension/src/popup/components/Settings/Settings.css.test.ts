import { describe, it, expect } from 'vitest'
import * as styles from './Settings.css'

describe('Settings styles', () => {
  it('exports container class', () => {
    expect(styles.container).toBeDefined()
    expect(typeof styles.container).toBe('string')
  })

  it('exports section class', () => {
    expect(styles.section).toBeDefined()
  })

  it('exports toggle class', () => {
    expect(styles.toggle).toBeDefined()
  })

  it('exports toggleActive class', () => {
    expect(styles.toggleActive).toBeDefined()
  })

  it('exports toggleKnob class', () => {
    expect(styles.toggleKnob).toBeDefined()
  })

  it('exports priceInput class', () => {
    expect(styles.priceInput).toBeDefined()
  })

  it('exports refreshButton class', () => {
    expect(styles.refreshButton).toBeDefined()
  })

  it('exports hint class', () => {
    expect(styles.hint).toBeDefined()
  })
})
