import { describe, it, expect } from 'vitest'
import * as styles from './Home.css'

describe('Home styles', () => {
  it('exports container class', () => {
    expect(styles.container).toBeDefined()
    expect(typeof styles.container).toBe('string')
  })

  it('exports vehicleSection class', () => {
    expect(styles.vehicleSection).toBeDefined()
  })

  it('exports priceCard class', () => {
    expect(styles.priceCard).toBeDefined()
  })

  it('exports pricesList class', () => {
    expect(styles.pricesList).toBeDefined()
  })

  it('exports statCard class', () => {
    expect(styles.statCard).toBeDefined()
  })
})
