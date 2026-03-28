import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { App } from './App'
import type { AppState } from '@utils/types'

const mockGetAppState = vi.fn<() => Promise<AppState>>()
const mockSetActiveCarId = vi.fn()

vi.mock('@utils/storage', () => ({
  getAppState: (...args: unknown[]) => mockGetAppState(...(args as [])),
  setActiveCarId: (...args: unknown[]) => mockSetActiveCarId(...args),
  addCar: vi.fn(),
  updateCar: vi.fn(),
  removeCar: vi.fn(),
  updateSettings: vi.fn().mockResolvedValue(undefined),
  updateFuelPrices: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@utils/carLookup', () => ({
  searchCars: vi.fn().mockResolvedValue([]),
  getTrims: vi.fn().mockResolvedValue([]),
}))

vi.mock('@utils/tripHistory', () => ({
  recordTrip: vi.fn().mockResolvedValue(undefined),
  getRecentTrips: vi.fn().mockResolvedValue([]),
  getTripStats: vi.fn().mockResolvedValue({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 }),
  clearTripHistory: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@utils/fuelPrices', () => ({
  fetchFuelPrices: vi.fn().mockResolvedValue({
    petrolPerLitre: 1.85,
    dieselPerLitre: 1.95,
    electricityPerKwh: 0.3,
    currency: 'AUD',
    lastUpdated: Date.now(),
    source: 'Test',
  }),
}))

function createMockState(): AppState {
  return {
    cars: [
      {
        id: '__average__',
        nickname: 'Average Car',
        isDefault: true,
        isLocked: true,
        fuelType: 'petrol',
        realWorldL100km: 10,
        officialL100km: 10,
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
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetAppState.mockResolvedValue(createMockState())
})

describe('App', () => {
  it('renders with home view by default', async () => {
    render(() => <App />)

    await waitFor(() => {
      expect(screen.getByText('Fuel Cost')).toBeInTheDocument()
    })
  })

  it('shows settings button on home view', async () => {
    render(() => <App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    })
  })

  it('does not show back button on home view', async () => {
    render(() => <App />)

    await waitFor(() => {
      expect(screen.getByText('Fuel Cost')).toBeInTheDocument()
    })
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument()
  })

  it('navigates to settings view', async () => {
    render(() => <App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Settings'))

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByLabelText('Go back')).toBeInTheDocument()
    })
  })

  it('navigates back to home from settings', async () => {
    render(() => <App />)

    await waitFor(() => {
      expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Settings'))

    await waitFor(() => {
      expect(screen.getByLabelText('Go back')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Go back'))

    await waitFor(() => {
      expect(screen.getByText('Fuel Cost')).toBeInTheDocument()
    })
  })

  it('navigates to add car view', async () => {
    render(() => <App />)

    await waitFor(() => {
      expect(screen.getByText('Add a car')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add a car'))

    await waitFor(() => {
      expect(screen.getByText('Add a car')).toBeInTheDocument()
      expect(screen.getByLabelText('Go back')).toBeInTheDocument()
    })
  })
})
