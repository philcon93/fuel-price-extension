import { describe, it, expect, beforeEach } from 'vitest'
import { recordTrip, getRecentTrips, clearTripHistory, getTripStats } from './tripHistory'
import type { TripRecord } from '@utils/types'

function createTrip(overrides?: Partial<Omit<TripRecord, 'id'>>): Omit<TripRecord, 'id'> {
  return {
    timestamp: Date.now(),
    distanceKm: 25.3,
    fuelCost: 4.5,
    carId: 'car-1',
    carNickname: 'My Corolla',
    fuelType: 'petrol',
    currency: 'AUD',
    ...overrides,
  }
}

beforeEach(async () => {
  await clearTripHistory()
})

describe('tripHistory', () => {
  it('records and retrieves a trip', async () => {
    await recordTrip(createTrip())
    const trips = await getRecentTrips()
    expect(trips).toHaveLength(1)
    expect(trips[0].carNickname).toBe('My Corolla')
  })

  it('retrieves trips in reverse chronological order', async () => {
    await recordTrip(createTrip({ timestamp: 1000, distanceKm: 10 }))
    await recordTrip(createTrip({ timestamp: 2000, distanceKm: 20 }))
    await recordTrip(createTrip({ timestamp: 3000, distanceKm: 30 }))

    const trips = await getRecentTrips()
    expect(trips).toHaveLength(3)
    expect(trips[0].distanceKm).toBe(30)
    expect(trips[2].distanceKm).toBe(10)
  })

  it('respects the limit parameter', async () => {
    await recordTrip(createTrip({ timestamp: 1000, distanceKm: 10 }))
    await recordTrip(createTrip({ timestamp: 2000, distanceKm: 20 }))
    await recordTrip(createTrip({ timestamp: 3000, distanceKm: 30 }))

    const trips = await getRecentTrips(2)
    expect(trips).toHaveLength(2)
  })

  it('deduplicates trips within the window', async () => {
    const now = Date.now()
    await recordTrip(createTrip({ timestamp: now }))
    await recordTrip(createTrip({ timestamp: now + 1000 }))

    const trips = await getRecentTrips()
    expect(trips).toHaveLength(1)
  })

  it('records trips with different distances as separate', async () => {
    const now = Date.now()
    await recordTrip(createTrip({ timestamp: now, distanceKm: 10 }))
    await recordTrip(createTrip({ timestamp: now + 1000, distanceKm: 50 }))

    const trips = await getRecentTrips()
    expect(trips).toHaveLength(2)
  })

  it('records trips outside the dedup window', async () => {
    await recordTrip(createTrip({ timestamp: 1000 }))
    await recordTrip(createTrip({ timestamp: 100_000 }))

    const trips = await getRecentTrips()
    expect(trips).toHaveLength(2)
  })

  it('clears all trips', async () => {
    await recordTrip(createTrip({ timestamp: 1000, distanceKm: 10 }))
    await recordTrip(createTrip({ timestamp: 2000, distanceKm: 20 }))
    await clearTripHistory()

    const trips = await getRecentTrips()
    expect(trips).toHaveLength(0)
  })

  it('computes stats correctly', async () => {
    await recordTrip(createTrip({ timestamp: 1000, distanceKm: 10, fuelCost: 2.5 }))
    await recordTrip(createTrip({ timestamp: 2000, distanceKm: 20, fuelCost: 5.0 }))

    const stats = await getTripStats()
    expect(stats.totalTrips).toBe(2)
    expect(stats.totalCost).toBeCloseTo(7.5)
    expect(stats.totalDistanceKm).toBeCloseTo(30)
  })

  it('returns zero stats when no trips exist', async () => {
    const stats = await getTripStats()
    expect(stats.totalTrips).toBe(0)
    expect(stats.totalCost).toBe(0)
    expect(stats.totalDistanceKm).toBe(0)
  })
})
