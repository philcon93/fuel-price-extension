import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { recordTripToStorage, queueTrip, DEDUP_WINDOW_MS, MAX_TRIPS } from '.'
import type { TripRecord } from '@utils/types'

interface StoredTrips {
  fuelCostTrips: { trips: TripRecord[] }
}

function getStoredTrips(): TripRecord[] {
  const saved = vi.mocked(chrome.storage.local.set).mock.calls[0][0] as StoredTrips
  return saved.fuelCostTrips.trips
}

function makeTripData(overrides?: Partial<Omit<TripRecord, 'id'>>): Omit<TripRecord, 'id'> {
  return {
    timestamp: Date.now(),
    distanceKm: 10,
    fuelCost: 5.0,
    carId: 'car-1',
    carNickname: 'My Car',
    fuelType: 'petrol',
    currency: 'AUD',
    ...overrides,
  }
}

describe('recordTripToStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('records a trip when storage is empty', async () => {
    chrome.storage.local.get = vi.fn().mockResolvedValue({})
    chrome.storage.local.set = vi.fn().mockResolvedValue(undefined)

    await recordTripToStorage(makeTripData())

    expect(chrome.storage.local.set).toHaveBeenCalledOnce()
    const trips = getStoredTrips()
    expect(trips).toHaveLength(1)
    expect(trips[0].distanceKm).toBe(10)
  })

  it('deduplicates trips within the window for the same car and distance', async () => {
    const existingTrip: TripRecord = {
      id: 1,
      timestamp: Date.now() - 5_000,
      distanceKm: 10,
      fuelCost: 5.0,
      carId: 'car-1',
      carNickname: 'My Car',
      fuelType: 'petrol',
      currency: 'AUD',
    }
    chrome.storage.local.get = vi
      .fn()
      .mockResolvedValue({ fuelCostTrips: { trips: [existingTrip] } })
    chrome.storage.local.set = vi.fn().mockResolvedValue(undefined)

    await recordTripToStorage(makeTripData())

    expect(chrome.storage.local.set).not.toHaveBeenCalled()
  })

  it('records trip for a different car even within the dedup window', async () => {
    const existingTrip: TripRecord = {
      id: 1,
      timestamp: Date.now() - 5_000,
      distanceKm: 10,
      fuelCost: 5.0,
      carId: 'car-1',
      carNickname: 'My Car',
      fuelType: 'petrol',
      currency: 'AUD',
    }
    chrome.storage.local.get = vi
      .fn()
      .mockResolvedValue({ fuelCostTrips: { trips: [existingTrip] } })
    chrome.storage.local.set = vi.fn().mockResolvedValue(undefined)

    await recordTripToStorage(makeTripData({ carId: 'car-2', carNickname: 'Other Car' }))

    expect(chrome.storage.local.set).toHaveBeenCalledOnce()
  })

  it('allows same car outside the dedup window', async () => {
    const existingTrip: TripRecord = {
      id: 1,
      timestamp: Date.now() - DEDUP_WINDOW_MS - 1_000,
      distanceKm: 10,
      fuelCost: 5.0,
      carId: 'car-1',
      carNickname: 'My Car',
      fuelType: 'petrol',
      currency: 'AUD',
    }
    chrome.storage.local.get = vi
      .fn()
      .mockResolvedValue({ fuelCostTrips: { trips: [existingTrip] } })
    chrome.storage.local.set = vi.fn().mockResolvedValue(undefined)

    await recordTripToStorage(makeTripData())

    expect(chrome.storage.local.set).toHaveBeenCalledOnce()
  })

  it('truncates to MAX_TRIPS', async () => {
    const existing = Array.from({ length: MAX_TRIPS }, (_, i) => ({
      id: i,
      timestamp: Date.now() - 60_000 * (i + 1),
      distanceKm: 100,
      fuelCost: 50,
      carId: 'car-1',
      carNickname: 'My Car',
      fuelType: 'petrol' as const,
      currency: 'AUD' as const,
    }))
    chrome.storage.local.get = vi.fn().mockResolvedValue({ fuelCostTrips: { trips: existing } })
    chrome.storage.local.set = vi.fn().mockResolvedValue(undefined)

    await recordTripToStorage(makeTripData({ distanceKm: 999 }))

    const trips = getStoredTrips()
    expect(trips).toHaveLength(MAX_TRIPS)
    expect(trips[0].distanceKm).toBe(999)
  })

  it('silently catches storage errors', async () => {
    chrome.storage.local.get = vi.fn().mockRejectedValue(new Error('storage error'))

    await expect(recordTripToStorage(makeTripData())).resolves.toBeUndefined()
  })
})

describe('queueTrip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    chrome.storage.local.get = vi.fn().mockResolvedValue({})
    chrome.storage.local.set = vi.fn().mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the longest distance per car', async () => {
    queueTrip(makeTripData({ distanceKm: 1.0, fuelCost: 0.5 }))
    queueTrip(makeTripData({ distanceKm: 5.4, fuelCost: 2.7 }))

    await vi.advanceTimersByTimeAsync(1_100)

    expect(chrome.storage.local.set).toHaveBeenCalledOnce()
    const trips = getStoredTrips()
    expect(trips[0].distanceKm).toBe(5.4)
  })

  it('ignores a shorter distance queued after a longer one', async () => {
    queueTrip(makeTripData({ distanceKm: 5.4, fuelCost: 2.7 }))
    queueTrip(makeTripData({ distanceKm: 1.0, fuelCost: 0.5 }))

    await vi.advanceTimersByTimeAsync(1_100)

    expect(chrome.storage.local.set).toHaveBeenCalledOnce()
    const trips = getStoredTrips()
    expect(trips[0].distanceKm).toBe(5.4)
  })

  it('keeps trips for different cars separately', async () => {
    queueTrip(makeTripData({ carId: 'car-1', distanceKm: 5.4, fuelCost: 2.7 }))
    queueTrip(makeTripData({ carId: 'car-2', distanceKm: 5.4, fuelCost: 1.5 }))

    await vi.advanceTimersByTimeAsync(1_100)

    expect(chrome.storage.local.set).toHaveBeenCalledTimes(2)
  })
})
