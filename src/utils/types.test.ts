import { describe, it, expect } from 'vitest'
import { AVERAGE_CAR_ID, MAX_FREE_CARS } from './types'

describe('constants', () => {
  it('AVERAGE_CAR_ID is a stable string', () => {
    expect(AVERAGE_CAR_ID).toBe('__average__')
  })

  it('MAX_FREE_CARS is 2', () => {
    expect(MAX_FREE_CARS).toBe(2)
  })
})
