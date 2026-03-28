import { describe, it, expect } from 'vitest'
import * as styles from './Cars.css'

describe('Cars styles', () => {
  it('exports container class', () => {
    expect(styles.container).toBeDefined()
    expect(typeof styles.container).toBe('string')
  })

  it('exports activeCard class', () => {
    expect(styles.activeCard).toBeDefined()
  })

  it('exports carList class', () => {
    expect(styles.carList).toBeDefined()
  })

  it('exports carItem class', () => {
    expect(styles.carItem).toBeDefined()
  })

  it('exports addCarCard class', () => {
    expect(styles.addCarCard).toBeDefined()
  })

  it('exports editButton class', () => {
    expect(styles.editButton).toBeDefined()
  })
})
