import { describe, it, expect } from 'vitest'
import * as styles from './Header.css'

describe('Header styles', () => {
  it('exports header class', () => {
    expect(styles.header).toBeDefined()
    expect(typeof styles.header).toBe('string')
  })

  it('exports headerLeft class', () => {
    expect(styles.headerLeft).toBeDefined()
  })

  it('exports title class', () => {
    expect(styles.title).toBeDefined()
  })

  it('exports backButton class', () => {
    expect(styles.backButton).toBeDefined()
  })

  it('exports settingsButton class', () => {
    expect(styles.settingsButton).toBeDefined()
  })
})
