import { describe, it, expect } from 'vitest'
import * as styles from './ManualEntry.css'

describe('ManualEntry styles', () => {
  it('exports form class', () => {
    expect(styles.form).toBeDefined()
    expect(typeof styles.form).toBe('string')
  })

  it('exports field class', () => {
    expect(styles.field).toBeDefined()
  })

  it('exports input class', () => {
    expect(styles.input).toBeDefined()
  })

  it('exports select class', () => {
    expect(styles.select).toBeDefined()
  })

  it('exports saveButton class', () => {
    expect(styles.saveButton).toBeDefined()
  })
})
