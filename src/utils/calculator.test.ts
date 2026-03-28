import { describe, it, expect } from 'vitest'
import {
  convertDistance,
  calcFuelUsed,
  calcCost,
  calcTripCost,
  formatCost,
  parseDistanceText,
} from './calculator'
import type { CarProfile, FuelPrices } from './types'

const petrolCar: CarProfile = {
  id: 'test-petrol',
  nickname: 'Test Petrol',
  isDefault: false,
  isLocked: false,
  fuelType: 'petrol',
  realWorldL100km: 8.0,
  officialL100km: 7.0,
  useRealWorld: true,
  isManual: false,
}

const dieselCar: CarProfile = {
  id: 'test-diesel',
  nickname: 'Test Diesel',
  isDefault: false,
  isLocked: false,
  fuelType: 'diesel',
  realWorldL100km: 6.5,
  useRealWorld: true,
  isManual: false,
}

const evCar: CarProfile = {
  id: 'test-ev',
  nickname: 'Test EV',
  isDefault: false,
  isLocked: false,
  fuelType: 'electric',
  kWh100km: 18,
  useRealWorld: false,
  isManual: false,
}

const phevCar: CarProfile = {
  id: 'test-phev',
  nickname: 'Test PHEV',
  isDefault: false,
  isLocked: false,
  fuelType: 'phev',
  realWorldL100km: 5.0,
  kWh100km: 15,
  electricRangeKm: 60,
  useRealWorld: true,
  isManual: false,
}

const prices: FuelPrices = {
  petrolPerLitre: 1.8,
  dieselPerLitre: 1.9,
  electricityPerKwh: 0.3,
  currency: 'AUD',
  lastUpdated: Date.now(),
  source: 'Test',
}

describe('convertDistance', () => {
  it('returns same value when units match', () => {
    expect(convertDistance(100, 'km', 'km')).toBe(100)
    expect(convertDistance(100, 'miles', 'miles')).toBe(100)
  })

  it('converts miles to km', () => {
    expect(convertDistance(100, 'miles', 'km')).toBeCloseTo(160.934, 2)
  })

  it('converts km to miles', () => {
    expect(convertDistance(160.934, 'km', 'miles')).toBeCloseTo(100, 1)
  })
})

describe('calcFuelUsed', () => {
  it('calculates petrol fuel usage', () => {
    const usage = calcFuelUsed(100, petrolCar)
    expect(usage.litres).toBeCloseTo(8.0, 2)
    expect(usage.kWh).toBe(0)
  })

  it('uses official L/100km when useRealWorld is false', () => {
    const car = { ...petrolCar, useRealWorld: false }
    const usage = calcFuelUsed(100, car)
    expect(usage.litres).toBeCloseTo(7.0, 2)
  })

  it('calculates diesel fuel usage', () => {
    const usage = calcFuelUsed(200, dieselCar)
    expect(usage.litres).toBeCloseTo(13.0, 2)
  })

  it('calculates EV energy usage', () => {
    const usage = calcFuelUsed(100, evCar)
    expect(usage.litres).toBe(0)
    expect(usage.kWh).toBeCloseTo(18, 2)
  })

  it('calculates PHEV usage within electric range', () => {
    const usage = calcFuelUsed(50, phevCar)
    expect(usage.litres).toBe(0)
    expect(usage.kWh).toBeCloseTo(7.5, 2)
  })

  it('calculates PHEV usage beyond electric range', () => {
    const usage = calcFuelUsed(160, phevCar)
    expect(usage.litres).toBeCloseTo(5.0, 2)
    expect(usage.kWh).toBeCloseTo(9.0, 2)
  })
})

describe('calcCost', () => {
  it('calculates petrol cost', () => {
    const usage = { litres: 8, kWh: 0 }
    const cost = calcCost(usage, prices, 'petrol')
    expect(cost).toBeCloseTo(14.4, 2)
  })

  it('calculates diesel cost using diesel price', () => {
    const usage = { litres: 8, kWh: 0 }
    const cost = calcCost(usage, prices, 'diesel')
    expect(cost).toBeCloseTo(15.2, 2)
  })

  it('calculates EV cost with charging loss', () => {
    const usage = { litres: 0, kWh: 18 }
    const cost = calcCost(usage, prices, 'electric')
    const expectedKwh = 18 / 0.88
    expect(cost).toBeCloseTo(expectedKwh * 0.3, 2)
  })

  it('calculates PHEV cost combining fuel and electricity', () => {
    const usage = { litres: 5, kWh: 9 }
    const cost = calcCost(usage, prices, 'phev')
    const fuelCost = 5 * 1.8
    const elecCost = (9 / 0.88) * 0.3
    expect(cost).toBeCloseTo(fuelCost + elecCost, 2)
  })
})

describe('calcTripCost', () => {
  it('calculates end-to-end trip cost for petrol car', () => {
    const cost = calcTripCost(100, petrolCar, prices)
    expect(cost).toBeCloseTo(14.4, 2)
  })

  it('handles zero distance', () => {
    expect(calcTripCost(0, petrolCar, prices)).toBe(0)
  })
})

describe('formatCost', () => {
  it('formats AUD currency', () => {
    const formatted = formatCost(14.4, 'AUD')
    expect(formatted).toContain('14.40')
  })

  it('formats USD currency', () => {
    const formatted = formatCost(10, 'USD')
    expect(formatted).toContain('10.00')
  })

  it('formats JPY currency', () => {
    const formatted = formatCost(1500, 'JPY')
    expect(formatted).toMatch(/1[,.]?500/)
  })
})

describe('parseDistanceText', () => {
  it('parses km distances', () => {
    const result = parseDistanceText('12.3 km')
    expect(result).toEqual({ value: 12.3, unit: 'km' })
  })

  it('parses mile distances', () => {
    const result = parseDistanceText('7.6 mi')
    expect(result).toEqual({ value: 7.6, unit: 'miles' })
  })

  it('parses "miles" spelled out', () => {
    const result = parseDistanceText('100 miles')
    expect(result).toEqual({ value: 100, unit: 'miles' })
  })

  it('parses distances with commas', () => {
    const result = parseDistanceText('1,234 km')
    expect(result).toEqual({ value: 1234, unit: 'km' })
  })

  it('returns null for non-matching text', () => {
    expect(parseDistanceText('hello')).toBeNull()
    expect(parseDistanceText('')).toBeNull()
    expect(parseDistanceText('5 hours')).toBeNull()
  })

  it('handles integer distances', () => {
    const result = parseDistanceText('42 km')
    expect(result).toEqual({ value: 42, unit: 'km' })
  })
})
