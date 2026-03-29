import { describe, it, expect } from 'vitest'
import * as styles from './NavBar.css'

describe('NavBar styles', () => {
  it('exports nav class', () => {
    expect(styles.nav).toBeDefined()
    expect(typeof styles.nav).toBe('string')
  })

  it('exports tab class', () => {
    expect(styles.tab).toBeDefined()
  })

  it('exports tabActive class', () => {
    expect(styles.tabActive).toBeDefined()
  })

  it('exports tabLabel class', () => {
    expect(styles.tabLabel).toBeDefined()
  })
})
