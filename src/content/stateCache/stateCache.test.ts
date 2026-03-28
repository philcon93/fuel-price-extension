import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getState, clearStateCache } from '.'
import type { AppState } from '@utils/types'

const mockState: AppState = {
  cars: [
    {
      id: '__average__',
      nickname: 'Average Car',
      isDefault: true,
      isLocked: true,
      fuelType: 'petrol',
      realWorldL100km: 10,
      useRealWorld: true,
      isManual: false,
    },
  ],
  activeCarId: '__average__',
  settings: {
    distanceUnit: 'km',
    efficiencyUnit: 'l100km',
    currency: 'AUD',
    showAverageComparison: true,
  },
  fuelPrices: {
    petrolPerLitre: 1.85,
    dieselPerLitre: 1.95,
    electricityPerKwh: 0.3,
    currency: 'AUD',
    lastUpdated: Date.now(),
    source: 'Test',
  },
}

describe('stateCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    clearStateCache()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches state from chrome.storage.sync', async () => {
    chrome.storage.sync.get = vi
      .fn()
      .mockResolvedValue({ fuelCostAppState: mockState })

    const state = await getState()

    expect(state).toEqual(mockState)
    expect(chrome.storage.sync.get).toHaveBeenCalledWith('fuelCostAppState')
  })

  it('returns cached state on subsequent calls', async () => {
    chrome.storage.sync.get = vi
      .fn()
      .mockResolvedValue({ fuelCostAppState: mockState })

    await getState()
    await getState()

    expect(chrome.storage.sync.get).toHaveBeenCalledOnce()
  })

  it('invalidates cache after TTL', async () => {
    chrome.storage.sync.get = vi
      .fn()
      .mockResolvedValue({ fuelCostAppState: mockState })

    await getState()
    vi.advanceTimersByTime(11_000)
    await getState()

    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(2)
  })

  it('clearStateCache forces a fresh fetch', async () => {
    chrome.storage.sync.get = vi
      .fn()
      .mockResolvedValue({ fuelCostAppState: mockState })

    await getState()
    clearStateCache()
    await getState()

    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(2)
  })

  it('returns null when storage is empty', async () => {
    chrome.storage.sync.get = vi.fn().mockResolvedValue({})

    const state = await getState()

    expect(state).toBeNull()
  })

  it('returns null on storage error', async () => {
    chrome.storage.sync.get = vi.fn().mockRejectedValue(new Error('fail'))

    const state = await getState()

    expect(state).toBeNull()
  })
})
