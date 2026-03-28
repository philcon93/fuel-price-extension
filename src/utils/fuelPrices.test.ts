import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resetChromeStores, getChromeMock } from '../test-setup'
import { fetchFuelPrices } from './fuelPrices'

beforeEach(() => {
  resetChromeStores()
  vi.clearAllMocks()
})

describe('fetchFuelPrices', () => {
  it('returns prices with expected shape', async () => {
    const prices = await fetchFuelPrices()
    expect(prices).toHaveProperty('petrolPerLitre')
    expect(prices).toHaveProperty('dieselPerLitre')
    expect(prices).toHaveProperty('electricityPerKwh')
    expect(prices).toHaveProperty('currency')
    expect(prices).toHaveProperty('lastUpdated')
    expect(prices).toHaveProperty('source')
  })

  it('returns positive price values', async () => {
    const prices = await fetchFuelPrices()
    expect(prices.petrolPerLitre).toBeGreaterThan(0)
    expect(prices.dieselPerLitre).toBeGreaterThan(0)
    expect(prices.electricityPerKwh).toBeGreaterThan(0)
  })

  it('sets lastUpdated to a recent timestamp', async () => {
    const before = Date.now()
    const prices = await fetchFuelPrices()
    expect(prices.lastUpdated).toBeGreaterThanOrEqual(before)
  })

  it('caches prices in chrome.storage.local', async () => {
    const mock = getChromeMock()
    await fetchFuelPrices()
    expect(mock.storage.local.set).toHaveBeenCalled()
  })

  it('returns cached prices when not expired', async () => {
    const mock = getChromeMock()
    const cached = {
      petrolPerLitre: 9.99,
      dieselPerLitre: 8.88,
      electricityPerKwh: 7.77,
      currency: 'AUD',
      lastUpdated: Date.now(),
      source: 'Cached',
    }
    mock.storage.local.get.mockResolvedValueOnce({ fuelPriceCache: cached })
    const prices = await fetchFuelPrices(false)
    expect(prices.petrolPerLitre).toBe(9.99)
    expect(prices.source).toBe('Cached')
  })

  it('bypasses cache when forceRefresh is true', async () => {
    const prices = await fetchFuelPrices(true)
    expect(prices.source).toBe('Regional averages')
  })

  it('fetches fresh prices when cache is expired', async () => {
    const mock = getChromeMock()
    const expired = {
      petrolPerLitre: 9.99,
      dieselPerLitre: 8.88,
      electricityPerKwh: 7.77,
      currency: 'AUD',
      lastUpdated: Date.now() - 25 * 60 * 60 * 1000,
      source: 'Old',
    }
    mock.storage.local.get.mockResolvedValueOnce({ fuelPriceCache: expired })
    const prices = await fetchFuelPrices(false)
    expect(prices.source).toBe('Regional averages')
  })
})
