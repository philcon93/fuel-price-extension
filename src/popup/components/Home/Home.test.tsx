import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@solidjs/testing-library'
import { Home } from './Home'
import { withQueryProvider } from '../../../test-setup'
import type { AppState } from '@utils/types'

const mockGetAppState = vi.fn<() => Promise<AppState>>()

vi.mock('@utils/storage', () => ({
  getAppState: (...args: unknown[]) => mockGetAppState(...(args as [])),
}))

function createMockState(overrides?: Partial<AppState>): AppState {
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
      {
        id: 'car-1',
        nickname: 'My Corolla',
        isDefault: false,
        isLocked: false,
        fuelType: 'petrol',
        make: 'Toyota',
        model: 'Corolla',
        year: 2023,
        engineSizeL: 1.8,
        realWorldL100km: 7.5,
        officialL100km: 6.5,
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
      source: 'Test source',
    },
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Home', () => {
  it('shows loading state initially', () => {
    mockGetAppState.mockReturnValue(new Promise(() => {}))
    render(withQueryProvider(() => <Home />))
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders active vehicle section after loading', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Home />))

    await waitFor(() => {
      expect(screen.getByText('Active Vessel')).toBeInTheDocument()
      expect(screen.getByText('Average Car')).toBeInTheDocument()
    })
  })

  it('shows fuel prices', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Home />))

    await waitFor(() => {
      expect(screen.getByText('Local Fuel Rates')).toBeInTheDocument()
    })
    expect(screen.getByText('Unleaded')).toBeInTheDocument()
    expect(screen.getByText('Diesel')).toBeInTheDocument()
    expect(screen.getByText('Electric')).toBeInTheDocument()
  })

  it('shows efficiency for active car', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))
    render(withQueryProvider(() => <Home />))

    await waitFor(() => {
      expect(screen.getByText('My Corolla')).toBeInTheDocument()
    })
    expect(screen.getByText('7.5')).toBeInTheDocument()
  })

  it('shows fuel type chip', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))
    render(withQueryProvider(() => <Home />))

    await waitFor(() => {
      expect(screen.getByText('Petrol')).toBeInTheDocument()
    })
  })
})
