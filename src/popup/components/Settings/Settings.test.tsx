import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { Settings } from './Settings'
import type { AppState } from '@utils/types'

const mockGetAppState = vi.fn<() => Promise<AppState>>()
const mockUpdateSettings = vi.fn()
const mockUpdateFuelPrices = vi.fn()
const mockFetchFuelPrices = vi.fn()

vi.mock('@utils/storage', () => ({
  getAppState: (...args: unknown[]) => mockGetAppState(...(args as [])),
  updateSettings: (...args: unknown[]) => mockUpdateSettings(...args),
  updateFuelPrices: (...args: unknown[]) => mockUpdateFuelPrices(...args),
}))

vi.mock('@utils/fuelPrices', () => ({
  fetchFuelPrices: (...args: unknown[]) => mockFetchFuelPrices(...args),
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
      source: 'API',
    },
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Settings', () => {
  it('shows loading state initially', () => {
    mockGetAppState.mockReturnValue(new Promise(() => {}))
    render(() => <Settings onBack={() => {}} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders settings sections after loading', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Units')).toBeInTheDocument()
    })
    expect(screen.getByText('Display')).toBeInTheDocument()
    expect(screen.getByText('Fuel prices')).toBeInTheDocument()
  })

  it('renders distance unit selector with correct value', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Distance')).toBeInTheDocument()
    })

    const distanceSelects = screen.getAllByRole('combobox')
    const distanceSelect = distanceSelects[0] as HTMLSelectElement
    expect(distanceSelect.value).toBe('km')
  })

  it('updates distance unit on change', async () => {
    const state = createMockState()
    mockGetAppState.mockResolvedValue(state)
    mockUpdateSettings.mockResolvedValue(undefined)

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Distance')).toBeInTheDocument()
    })

    const distanceSelects = screen.getAllByRole('combobox')
    fireEvent.change(distanceSelects[0], { target: { value: 'miles' } })

    expect(mockUpdateSettings).toHaveBeenCalledWith({ distanceUnit: 'miles' })
  })

  it('updates currency on change', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    mockUpdateSettings.mockResolvedValue(undefined)

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Units')).toBeInTheDocument()
    })

    const selects = screen.getAllByRole('combobox')
    const currencySelect = selects.find(
      (el) => (el as HTMLSelectElement).value === 'AUD',
    ) as HTMLSelectElement
    fireEvent.change(currencySelect, { target: { value: 'USD' } })

    expect(mockUpdateSettings).toHaveBeenCalledWith({ currency: 'USD' })
  })

  it('disables comparison toggle when average car is active', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: '__average__' }))

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle average comparison')).toBeInTheDocument()
    })

    const toggle = screen.getByLabelText('Toggle average comparison') as HTMLButtonElement
    expect(toggle.disabled).toBe(true)
  })

  it('shows hint text when average car is active', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: '__average__' }))

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(
        screen.getByText('Switch to a custom car to compare against the average'),
      ).toBeInTheDocument()
    })
  })

  it('enables comparison toggle when non-average car is active', async () => {
    const state = createMockState({ activeCarId: 'custom-car' })
    state.cars.push({
      id: 'custom-car',
      nickname: 'My Car',
      isDefault: false,
      isLocked: false,
      fuelType: 'petrol',
      realWorldL100km: 8,
      useRealWorld: true,
      isManual: true,
    })
    mockGetAppState.mockResolvedValue(state)

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle average comparison')).toBeInTheDocument()
    })

    const toggle = screen.getByLabelText('Toggle average comparison') as HTMLButtonElement
    expect(toggle.disabled).toBe(false)
  })

  it('renders fuel price inputs', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Petrol (per L)')).toBeInTheDocument()
    })
    expect(screen.getByText('Diesel (per L)')).toBeInTheDocument()
    expect(screen.getByText('Electricity (per kWh)')).toBeInTheDocument()
  })

  it('shows the Refresh button', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })
  })

  it('calls fetchFuelPrices on refresh', async () => {
    const prices = {
      petrolPerLitre: 2.0,
      dieselPerLitre: 2.1,
      electricityPerKwh: 0.35,
      currency: 'AUD' as const,
      lastUpdated: Date.now(),
      source: 'Refreshed',
    }
    mockGetAppState.mockResolvedValue(createMockState())
    mockFetchFuelPrices.mockResolvedValue(prices)
    mockUpdateFuelPrices.mockResolvedValue(undefined)

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Refresh'))
    expect(mockFetchFuelPrices).toHaveBeenCalledWith(true)
  })

  it('shows source info', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <Settings onBack={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText(/API/)).toBeInTheDocument()
    })
  })
})
