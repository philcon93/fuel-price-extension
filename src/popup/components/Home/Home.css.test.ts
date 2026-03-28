import { describe, it, expect } from 'vitest'
import * as styles from './Home.css'

describe('Home styles', () => {
  it('exports container class', () => {
    expect(styles.container).toBeDefined()
    expect(typeof styles.container).toBe('string')
  })

  it('exports section class', () => {
    expect(styles.section).toBeDefined()
  })

  it('exports carSelect class', () => {
    expect(styles.carSelect).toBeDefined()
  })

  it('exports pricesGrid class', () => {
    expect(styles.pricesGrid).toBeDefined()
  })

  it('exports priceCard class', () => {
    expect(styles.priceCard).toBeDefined()
  })

  it('exports addCarLink class', () => {
    expect(styles.addCarLink).toBeDefined()
  })
})
