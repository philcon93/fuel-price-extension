import { describe, it, expect, beforeEach } from 'vitest'
import { resetChromeStores } from '../test-setup'
import {
  getAppState,
  setActiveCarId,
  addCar,
  updateCar,
  removeCar,
  updateSettings,
  updateFuelPrices,
} from './storage'
import { AVERAGE_CAR_ID, type FuelPrices } from './types'

beforeEach(() => {
  resetChromeStores()
})

describe('getAppState', () => {
  it('returns a default state with Average Car on first call', async () => {
    const state = await getAppState()
    expect(state.cars).toHaveLength(1)
    expect(state.cars[0].id).toBe(AVERAGE_CAR_ID)
    expect(state.cars[0].isDefault).toBe(true)
    expect(state.cars[0].isLocked).toBe(true)
    expect(state.activeCarId).toBe(AVERAGE_CAR_ID)
  })

  it('returns consistent state across multiple calls', async () => {
    const first = await getAppState()
    const second = await getAppState()
    expect(first.activeCarId).toBe(second.activeCarId)
    expect(first.cars.length).toBe(second.cars.length)
  })

  it('includes settings with valid defaults', async () => {
    const state = await getAppState()
    expect(state.settings.distanceUnit).toMatch(/^(km|miles)$/)
    expect(state.settings.efficiencyUnit).toMatch(/^(l100km|mpg|kwh100km)$/)
    expect(state.settings.showAverageComparison).toBe(true)
  })

  it('includes fuel prices', async () => {
    const state = await getAppState()
    expect(state.fuelPrices.petrolPerLitre).toBeGreaterThan(0)
    expect(state.fuelPrices.dieselPerLitre).toBeGreaterThan(0)
  })
})

describe('setActiveCarId', () => {
  it('changes the active car', async () => {
    const car = await addCar({
      nickname: 'Test',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      useRealWorld: true,
      isManual: true,
    })
    await setActiveCarId(car.id)
    const state = await getAppState()
    expect(state.activeCarId).toBe(car.id)
  })

  it('does nothing for non-existent car id', async () => {
    await setActiveCarId('nonexistent')
    const state = await getAppState()
    expect(state.activeCarId).toBe(AVERAGE_CAR_ID)
  })
})

describe('addCar', () => {
  it('adds a car and sets it as active', async () => {
    const car = await addCar({
      nickname: 'My Car',
      isDefault: false,
      isLocked: false,
      fuelType: 'diesel',
      useRealWorld: true,
      isManual: true,
    })
    expect(car.id).toBeTruthy()
    expect(car.nickname).toBe('My Car')
    const state = await getAppState()
    expect(state.cars).toHaveLength(2)
    expect(state.activeCarId).toBe(car.id)
  })

  it('generates unique ids for each car', async () => {
    const car1 = await addCar({
      nickname: 'Car 1',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      useRealWorld: true,
      isManual: true,
    })
    const car2 = await addCar({
      nickname: 'Car 2',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      useRealWorld: true,
      isManual: true,
    })
    expect(car1.id).not.toBe(car2.id)
  })
})

describe('updateCar', () => {
  it('updates a non-locked car', async () => {
    const car = await addCar({
      nickname: 'Old Name',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      useRealWorld: true,
      isManual: true,
    })
    await updateCar(car.id, { nickname: 'New Name' })
    const state = await getAppState()
    const updated = state.cars.find((c) => c.id === car.id)
    expect(updated?.nickname).toBe('New Name')
  })

  it('refuses to update a locked car (Average Car)', async () => {
    await getAppState()
    await updateCar(AVERAGE_CAR_ID, { nickname: 'Hacked' })
    const state = await getAppState()
    expect(state.cars[0].nickname).toBe('Average Car')
  })

  it('does nothing for non-existent id', async () => {
    const before = await getAppState()
    await updateCar('nonexistent', { nickname: 'X' })
    const after = await getAppState()
    expect(before.cars.length).toBe(after.cars.length)
  })
})

describe('removeCar', () => {
  it('removes a non-locked car', async () => {
    const car = await addCar({
      nickname: 'Temp',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      useRealWorld: true,
      isManual: true,
    })
    await removeCar(car.id)
    const state = await getAppState()
    expect(state.cars.find((c) => c.id === car.id)).toBeUndefined()
  })

  it('resets active car to Average when active car is removed', async () => {
    const car = await addCar({
      nickname: 'Active',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      useRealWorld: true,
      isManual: true,
    })
    await setActiveCarId(car.id)
    await removeCar(car.id)
    const state = await getAppState()
    expect(state.activeCarId).toBe(AVERAGE_CAR_ID)
  })

  it('refuses to remove the Average Car', async () => {
    await getAppState()
    await removeCar(AVERAGE_CAR_ID)
    const state = await getAppState()
    expect(state.cars.find((c) => c.id === AVERAGE_CAR_ID)).toBeDefined()
  })
})

describe('updateSettings', () => {
  it('updates individual settings', async () => {
    await updateSettings({ distanceUnit: 'miles' })
    const state = await getAppState()
    expect(state.settings.distanceUnit).toBe('miles')
  })

  it('preserves other settings when updating one', async () => {
    await getAppState()
    await updateSettings({ distanceUnit: 'miles' })
    const state = await getAppState()
    expect(state.settings.showAverageComparison).toBe(true)
  })
})

describe('updateFuelPrices', () => {
  it('updates fuel prices in state', async () => {
    const newPrices: FuelPrices = {
      petrolPerLitre: 2.5,
      dieselPerLitre: 2.6,
      electricityPerKwh: 0.4,
      currency: 'GBP',
      lastUpdated: Date.now(),
      source: 'Manual',
    }
    await updateFuelPrices(newPrices)
    const state = await getAppState()
    expect(state.fuelPrices.petrolPerLitre).toBe(2.5)
    expect(state.fuelPrices.source).toBe('Manual')
  })
})
