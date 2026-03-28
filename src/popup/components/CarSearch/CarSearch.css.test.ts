import { describe, it, expect } from 'vitest'
import * as styles from './CarSearch.css'

describe('CarSearch styles', () => {
  it('exports container class', () => {
    expect(styles.container).toBeDefined()
    expect(typeof styles.container).toBe('string')
  })

  it('exports searchInput class', () => {
    expect(styles.searchInput).toBeDefined()
  })

  it('exports resultsList class', () => {
    expect(styles.resultsList).toBeDefined()
  })

  it('exports resultItem class', () => {
    expect(styles.resultItem).toBeDefined()
  })

  it('exports deleteButton class', () => {
    expect(styles.deleteButton).toBeDefined()
  })

  it('exports toggleLink class', () => {
    expect(styles.toggleLink).toBeDefined()
  })
})
