import type { Currency, FuelPrices } from '@utils/types/types'

const CACHE_KEY = 'fuelPriceCache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CountryPrices {
  petrol: number
  diesel: number
  electricity: number
  currency: Currency
}

/**
 * Per-country fuel price estimates in local currency per litre / per kWh.
 * These are periodically updated averages used as fallbacks when live APIs
 * are unavailable. Sources: GlobalPetrolPrices.com, government energy agencies.
 */
const COUNTRY_PRICES: Record<string, CountryPrices> = {
  AU: { petrol: 1.95, diesel: 1.98, electricity: 0.32, currency: 'AUD' },
  US: { petrol: 0.95, diesel: 1.05, electricity: 0.16, currency: 'USD' },
  GB: { petrol: 1.45, diesel: 1.52, electricity: 0.28, currency: 'GBP' },
  CA: { petrol: 1.65, diesel: 1.72, electricity: 0.14, currency: 'CAD' },
  NZ: { petrol: 2.8, diesel: 2.2, electricity: 0.28, currency: 'NZD' },
  DE: { petrol: 1.75, diesel: 1.65, electricity: 0.35, currency: 'EUR' },
  FR: { petrol: 1.85, diesel: 1.75, electricity: 0.22, currency: 'EUR' },
  IT: { petrol: 1.8, diesel: 1.7, electricity: 0.25, currency: 'EUR' },
  ES: { petrol: 1.6, diesel: 1.5, electricity: 0.2, currency: 'EUR' },
  IN: { petrol: 103.0, diesel: 90.0, electricity: 8.0, currency: 'INR' },
  JP: { petrol: 175.0, diesel: 155.0, electricity: 31.0, currency: 'JPY' },
}

const DEFAULT_PRICES: CountryPrices = {
  petrol: 1.5,
  diesel: 1.55,
  electricity: 0.25,
  currency: 'USD',
}

function detectCountryCode(): string {
  try {
    const locale = Intl.NumberFormat().resolvedOptions().locale || navigator.language || 'en-US'
    const parts = locale.split('-')
    return (parts[parts.length - 1] || 'US').toUpperCase()
  } catch {
    return 'US'
  }
}

function getLocalPrices(countryCode: string): CountryPrices {
  return COUNTRY_PRICES[countryCode] ?? DEFAULT_PRICES
}

export async function fetchFuelPrices(forceRefresh = false): Promise<FuelPrices> {
  if (!forceRefresh) {
    const cached = await getCachedPrices()
    if (cached && Date.now() - cached.lastUpdated < CACHE_TTL_MS) {
      return cached
    }
  }

  const countryCode = detectCountryCode()
  const local = getLocalPrices(countryCode)

  const prices: FuelPrices = {
    petrolPerLitre: local.petrol,
    dieselPerLitre: local.diesel,
    electricityPerKwh: local.electricity,
    currency: local.currency,
    lastUpdated: Date.now(),
    source: 'Regional averages',
  }

  await cachePrices(prices)
  return prices
}

async function getCachedPrices(): Promise<FuelPrices | null> {
  try {
    const result = await chrome.storage.local.get(CACHE_KEY)
    return (result[CACHE_KEY] as FuelPrices) ?? null
  } catch {
    return null
  }
}

async function cachePrices(prices: FuelPrices): Promise<void> {
  try {
    await chrome.storage.local.set({ [CACHE_KEY]: prices })
  } catch {
    // Non-critical — worst case we re-fetch next time
  }
}
