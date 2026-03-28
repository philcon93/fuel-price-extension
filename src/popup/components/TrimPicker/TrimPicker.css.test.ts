import { describe, it, expect } from 'vitest'
import * as styles from './TrimPicker.css'

describe('TrimPicker styles', () => {
  it('exports container class', () => {
    expect(styles.container).toBeDefined()
    expect(typeof styles.container).toBe('string')
  })

  it('exports trimList class', () => {
    expect(styles.trimList).toBeDefined()
  })

  it('exports trimItem class', () => {
    expect(styles.trimItem).toBeDefined()
  })

  it('exports backLink class', () => {
    expect(styles.backLink).toBeDefined()
  })

  it('exports heading class', () => {
    expect(styles.heading).toBeDefined()
  })
})
