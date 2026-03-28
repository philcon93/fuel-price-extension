import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { Cars } from './Cars'
import { withQueryProvider } from '../../../test-setup'
import type { AppState } from '@utils/types'

const mockGetAppState = vi.fn<() => Promise<AppState>>()
const mockSetActiveCarId = vi.fn<(id: string) => Promise<void>>()

vi.mock('@utils/storage', () => ({
  getAppState: (...args: unknown[]) => mockGetAppState(...(args as [])),
  setActiveCarId: (...args: unknown[]) => mockSetActiveCarId(...(args as [string])),
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
      source: 'Test',
    },
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Cars', () => {
  it('shows loading state initially', () => {
    mockGetAppState.mockReturnValue(new Promise(() => {}))
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Your Garage')).toBeInTheDocument()
    })
  })

  it('shows active car card', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Current Active')).toBeInTheDocument()
      expect(screen.getByText('Average Car')).toBeInTheDocument()
    })
  })

  it('shows other cars in stored vehicles list', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Stored Vehicles')).toBeInTheDocument()
      expect(screen.getByText('My Corolla')).toBeInTheDocument()
    })
  })

  it('shows add car card', async () => {
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Register New Vehicle')).toBeInTheDocument()
    })
  })

  it('calls onAddCar when add car is clicked', async () => {
    const onAddCar = vi.fn()
    mockGetAppState.mockResolvedValue(createMockState())
    render(withQueryProvider(() => <Cars onAddCar={onAddCar} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Register New Vehicle')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Register New Vehicle'))
    expect(onAddCar).toHaveBeenCalledOnce()
  })

  it('calls onEditCar when edit button is clicked on active car', async () => {
    const onEditCar = vi.fn()
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={onEditCar} />))

    await waitFor(() => {
      expect(screen.getByText('Edit Configuration')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Edit Configuration'))
    expect(onEditCar).toHaveBeenCalledWith('car-1')
  })

  it('does not show edit button for locked cars', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: '__average__' }))
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Current Active')).toBeInTheDocument()
    })
    expect(screen.queryByText('Edit Configuration')).not.toBeInTheDocument()
  })

  it('allows setting default car as active from stored vehicles', async () => {
    mockSetActiveCarId.mockResolvedValue(undefined)
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))
    render(withQueryProvider(() => <Cars onAddCar={() => {}} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Average Car')).toBeInTheDocument()
    })

    const setActiveButton = screen.getByLabelText('Set as active')
    expect(setActiveButton).toBeInTheDocument()
    fireEvent.click(setActiveButton)
    expect(mockSetActiveCarId).toHaveBeenCalledWith('__average__')
  })

  it('shows alert when at MAX_FREE_CARS limit', async () => {
    const onAddCar = vi.fn()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const state = createMockState()
    state.cars.push({
      id: 'car-2',
      nickname: 'Second Car',
      isDefault: false,
      isLocked: false,
      fuelType: 'diesel',
      realWorldL100km: 8,
      useRealWorld: true,
      isManual: true,
    })
    mockGetAppState.mockResolvedValue(state)

    render(withQueryProvider(() => <Cars onAddCar={onAddCar} onEditCar={() => {}} />))

    await waitFor(() => {
      expect(screen.getByText('Register New Vehicle')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Register New Vehicle'))
    expect(alertSpy).toHaveBeenCalledWith('Upgrade to Pro for unlimited car profiles')
    expect(onAddCar).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })
})
