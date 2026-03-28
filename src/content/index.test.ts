import { describe, it, expect } from 'vitest'
import { parseDistanceText, convertDistance, calcTripCost, formatCost } from '../utils/calculator'
import { AVERAGE_CAR_ID } from '../utils/types'
import type { CarProfile, FuelPrices, AppState } from '../utils/types'

describe('content script logic', () => {
  const prices: FuelPrices = {
    petrolPerLitre: 1.8,
    dieselPerLitre: 1.9,
    electricityPerKwh: 0.3,
    currency: 'AUD',
    lastUpdated: Date.now(),
    source: 'Test',
  }

  const averageCar: CarProfile = {
    id: AVERAGE_CAR_ID,
    nickname: 'Average Car',
    isDefault: true,
    isLocked: true,
    fuelType: 'petrol',
    realWorldL100km: 10.0,
    useRealWorld: true,
    isManual: false,
  }

  const customCar: CarProfile = {
    id: 'custom-1',
    nickname: 'My Car',
    isDefault: false,
    isLocked: false,
    fuelType: 'petrol',
    realWorldL100km: 7.5,
    useRealWorld: true,
    isManual: true,
  }

  describe('distance text parsing (used by content script scanner)', () => {
    it('extracts km from Google Maps distance text', () => {
      expect(parseDistanceText('25.3 km')).toEqual({ value: 25.3, unit: 'km' })
    })

    it('extracts miles from Google Maps distance text', () => {
      expect(parseDistanceText('15 mi')).toEqual({ value: 15, unit: 'miles' })
    })

    it('rejects time-like text', () => {
      expect(parseDistanceText('2 hr 15 min')).toBeNull()
    })

    it('rejects random text', () => {
      expect(parseDistanceText('via Hume Hwy')).toBeNull()
    })
  })

  describe('cost calculation pipeline (mimics processDistanceNode)', () => {
    it('calculates cost for a 100km trip with average car', () => {
      const distanceKm = convertDistance(100, 'km', 'km')
      const cost = calcTripCost(distanceKm, averageCar, prices)
      expect(cost).toBeCloseTo(18.0, 1)
    })

    it('calculates cost for a mile-based route', () => {
      const distanceKm = convertDistance(62, 'miles', 'km')
      const cost = calcTripCost(distanceKm, customCar, prices)
      expect(cost).toBeGreaterThan(0)
      expect(cost).toBeLessThan(30)
    })

    it('produces comparison cost between custom and average car', () => {
      const distanceKm = 100
      const customCost = calcTripCost(distanceKm, customCar, prices)
      const avgCost = calcTripCost(distanceKm, averageCar, prices)
      expect(customCost).toBeLessThan(avgCost)
    })

    it('formats costs with currency symbol', () => {
      const cost = calcTripCost(100, averageCar, prices)
      const formatted = formatCost(cost, 'AUD')
      expect(formatted).toContain('18.00')
    })
  })

  describe('comparison display logic', () => {
    it('should show comparison when active car is not average', () => {
      const state: AppState = {
        cars: [averageCar, customCar],
        activeCarId: customCar.id,
        settings: {
          distanceUnit: 'km',
          efficiencyUnit: 'l100km',
          currency: 'AUD',
          showAverageComparison: true,
        },
        fuelPrices: prices,
      }
      const showComparison =
        state.settings.showAverageComparison && state.activeCarId !== AVERAGE_CAR_ID
      expect(showComparison).toBe(true)
    })

    it('should not show comparison when average car is active', () => {
      const state: AppState = {
        cars: [averageCar, customCar],
        activeCarId: AVERAGE_CAR_ID,
        settings: {
          distanceUnit: 'km',
          efficiencyUnit: 'l100km',
          currency: 'AUD',
          showAverageComparison: true,
        },
        fuelPrices: prices,
      }
      const showComparison =
        state.settings.showAverageComparison && state.activeCarId !== AVERAGE_CAR_ID
      expect(showComparison).toBe(false)
    })

    it('should not show comparison when toggle is off', () => {
      const state: AppState = {
        cars: [averageCar, customCar],
        activeCarId: customCar.id,
        settings: {
          distanceUnit: 'km',
          efficiencyUnit: 'l100km',
          currency: 'AUD',
          showAverageComparison: false,
        },
        fuelPrices: prices,
      }
      const showComparison =
        state.settings.showAverageComparison && state.activeCarId !== AVERAGE_CAR_ID
      expect(showComparison).toBe(false)
    })
  })
})
