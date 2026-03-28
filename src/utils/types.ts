export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'phev' | 'electric'
export type DistanceUnit = 'km' | 'miles'
export type EfficiencyUnit = 'l100km' | 'mpg' | 'kwh100km'
export type Currency = 'AUD' | 'USD' | 'GBP' | 'EUR' | 'NZD' | 'CAD' | 'INR' | 'JPY'

export const AVERAGE_CAR_ID = '__average__'

export const MAX_FREE_CARS = 2

export interface CarProfile {
  id: string
  nickname: string
  isDefault: boolean
  isLocked: boolean

  make?: string
  model?: string
  year?: number
  trim?: string
  fuelType: FuelType
  engineSizeL?: number

  officialL100km?: number
  realWorldL100km?: number
  useRealWorld: boolean

  kWh100km?: number
  electricRangeKm?: number

  isManual: boolean
}

export interface UserSettings {
  distanceUnit: DistanceUnit
  efficiencyUnit: EfficiencyUnit
  currency: Currency
  showAverageComparison: boolean
}

export interface FuelPrices {
  petrolPerLitre: number
  dieselPerLitre: number
  electricityPerKwh: number
  currency: Currency
  lastUpdated: number
  source: string
}

export interface AppState {
  cars: CarProfile[]
  activeCarId: string
  settings: UserSettings
  fuelPrices: FuelPrices
}

export type PopupView =
  | { kind: 'home' }
  | { kind: 'addCar' }
  | { kind: 'editCar'; carId: string }
  | { kind: 'settings' }

export interface CarQueryTrim {
  modelId: string
  makeDisplay: string
  modelName: string
  modelYear: number
  modelTrim: string
  modelEngineCC: number
  modelEngineFuel: string
  modelLkm_hwy?: number
  modelLkm_city?: number
  modelLkm_mixed?: number
  modelBody: string
  modelDrive: string
  modelTransmissionType: string
}
