import type { CarProfile, Currency, FuelPrices, FuelType } from '@utils/types/types'

const KM_PER_MILE = 1.60934
const CHARGING_EFFICIENCY = 0.88

export interface FuelUsage {
  litres: number
  kWh: number
}

export function convertDistance(value: number, from: 'km' | 'miles', to: 'km' | 'miles'): number {
  if (from === to) return value
  return from === 'miles' ? value * KM_PER_MILE : value / KM_PER_MILE
}

export function calcFuelUsed(distanceKm: number, profile: CarProfile): FuelUsage {
  const l100km = profile.useRealWorld
    ? (profile.realWorldL100km ?? profile.officialL100km ?? 10)
    : (profile.officialL100km ?? profile.realWorldL100km ?? 10)

  switch (profile.fuelType) {
    case 'petrol':
    case 'diesel':
      return {
        litres: (distanceKm / 100) * l100km,
        kWh: 0,
      }

    case 'electric':
      return {
        litres: 0,
        kWh: (distanceKm / 100) * (profile.kWh100km ?? 15),
      }

    case 'hybrid':
      return {
        litres: (distanceKm / 100) * l100km,
        kWh: 0,
      }

    case 'phev': {
      const electricRangeKm = profile.electricRangeKm ?? 50
      const electricKm = Math.min(distanceKm, electricRangeKm)
      const petrolKm = Math.max(0, distanceKm - electricRangeKm)
      return {
        litres: (petrolKm / 100) * l100km,
        kWh: (electricKm / 100) * (profile.kWh100km ?? 15),
      }
    }

    default:
      return { litres: (distanceKm / 100) * l100km, kWh: 0 }
  }
}

export function calcCost(usage: FuelUsage, prices: FuelPrices, fuelType: FuelType): number {
  let cost = 0

  if (usage.litres > 0) {
    const pricePerLitre = fuelType === 'diesel' ? prices.dieselPerLitre : prices.petrolPerLitre
    cost += usage.litres * pricePerLitre
  }

  if (usage.kWh > 0) {
    const kWhWithLoss = usage.kWh / CHARGING_EFFICIENCY
    cost += kWhWithLoss * prices.electricityPerKwh
  }

  return Math.round(cost * 100) / 100
}

export function calcTripCost(distanceKm: number, profile: CarProfile, prices: FuelPrices): number {
  const usage = calcFuelUsed(distanceKm, profile)
  return calcCost(usage, prices, profile.fuelType)
}

export function formatCost(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function parseDistanceText(text: string): { value: number; unit: 'km' | 'miles' } | null {
  const match = text.trim().match(/^([\d,.]+)\s*(km|mi|miles?)$/i)
  if (!match) return null

  const value = parseFloat(match[1].replace(/,/g, ''))
  if (isNaN(value)) return null

  const unit: 'km' | 'miles' = match[2].toLowerCase().startsWith('mi') ? 'miles' : 'km'
  return { value, unit }
}
