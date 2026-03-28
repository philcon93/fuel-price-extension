import {
  AVERAGE_CAR_ID,
  type AppState,
  type CarProfile,
  type Currency,
  type DistanceUnit,
  type EfficiencyUnit,
  type FuelPrices,
  type UserSettings,
} from './types'

const STORAGE_KEY = 'fuelCostAppState'

const FLEET_AVERAGES: Record<string, number> = {
  AU: 11.1,
  US: 10.7,
  GB: 8.9,
  DE: 7.8,
  FR: 7.8,
  IT: 7.8,
  ES: 7.8,
  NZ: 10.0,
  CA: 10.5,
  IN: 8.5,
  JP: 7.0,
}
const DEFAULT_L100KM = 10.0

function detectLocaleInfo(): { currency: Currency; distanceUnit: DistanceUnit; countryCode: string } {
  try {
    const locale = Intl.NumberFormat().resolvedOptions().locale || navigator.language || 'en-US'
    const parts = locale.split('-')
    const country = (parts[parts.length - 1] || 'US').toUpperCase()

    const currencyMap: Record<string, Currency> = {
      AU: 'AUD', US: 'USD', GB: 'GBP', NZ: 'NZD', CA: 'CAD',
      DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
      IN: 'INR', JP: 'JPY',
    }

    const milesCountries = new Set(['US', 'GB'])

    return {
      currency: currencyMap[country] || 'USD',
      distanceUnit: milesCountries.has(country) ? 'miles' : 'km',
      countryCode: country,
    }
  } catch {
    return { currency: 'USD', distanceUnit: 'km', countryCode: 'US' }
  }
}

function createDefaultState(): AppState {
  const locale = detectLocaleInfo()
  const fleetAvg = FLEET_AVERAGES[locale.countryCode] ?? DEFAULT_L100KM

  const averageCar: CarProfile = {
    id: AVERAGE_CAR_ID,
    nickname: 'Average Car',
    isDefault: true,
    isLocked: true,
    fuelType: 'petrol',
    realWorldL100km: fleetAvg,
    officialL100km: fleetAvg,
    useRealWorld: true,
    isManual: false,
  }

  const defaultPrices: FuelPrices = {
    petrolPerLitre: 1.80,
    dieselPerLitre: 1.90,
    electricityPerKwh: 0.30,
    currency: locale.currency,
    lastUpdated: 0,
    source: 'Default estimates',
  }

  const settings: UserSettings = {
    distanceUnit: locale.distanceUnit,
    efficiencyUnit: locale.distanceUnit === 'miles' ? 'mpg' : 'l100km',
    currency: locale.currency,
    showAverageComparison: true,
  }

  return {
    cars: [averageCar],
    activeCarId: AVERAGE_CAR_ID,
    settings,
    fuelPrices: defaultPrices,
  }
}

export async function getAppState(): Promise<AppState> {
  const result = await chrome.storage.sync.get(STORAGE_KEY)
  if (result[STORAGE_KEY]) {
    const state = result[STORAGE_KEY] as AppState
    if (!state.cars.find(c => c.id === AVERAGE_CAR_ID)) {
      const defaultState = createDefaultState()
      state.cars.unshift(defaultState.cars[0])
    }
    return state
  }
  const defaultState = createDefaultState()
  await chrome.storage.sync.set({ [STORAGE_KEY]: defaultState })
  return defaultState
}

async function saveAppState(state: AppState): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: state })
}

export async function setActiveCarId(carId: string): Promise<void> {
  const state = await getAppState()
  if (state.cars.find(c => c.id === carId)) {
    state.activeCarId = carId
    await saveAppState(state)
  }
}

export async function addCar(profile: Omit<CarProfile, 'id'>): Promise<CarProfile> {
  const state = await getAppState()
  const car: CarProfile = {
    ...profile,
    id: crypto.randomUUID(),
  }
  state.cars.push(car)
  state.activeCarId = car.id
  await saveAppState(state)
  return car
}

export async function updateCar(carId: string, updates: Partial<Omit<CarProfile, 'id'>>): Promise<void> {
  const state = await getAppState()
  const idx = state.cars.findIndex(c => c.id === carId)
  if (idx === -1 || state.cars[idx].isLocked) return
  state.cars[idx] = { ...state.cars[idx], ...updates }
  await saveAppState(state)
}

export async function removeCar(carId: string): Promise<void> {
  const state = await getAppState()
  const car = state.cars.find(c => c.id === carId)
  if (!car || car.isLocked) return
  state.cars = state.cars.filter(c => c.id !== carId)
  if (state.activeCarId === carId) {
    state.activeCarId = AVERAGE_CAR_ID
  }
  await saveAppState(state)
}

export async function updateSettings(updates: Partial<UserSettings>): Promise<void> {
  const state = await getAppState()
  state.settings = { ...state.settings, ...updates }
  await saveAppState(state)
}

export async function updateFuelPrices(prices: FuelPrices): Promise<void> {
  const state = await getAppState()
  state.fuelPrices = prices
  await saveAppState(state)
}
