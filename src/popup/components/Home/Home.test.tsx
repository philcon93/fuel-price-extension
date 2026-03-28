import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { Home } from './Home'
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
    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders car selector after loading', async () => {
    const state = createMockState()
    mockGetAppState.mockResolvedValue(state)

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Active car')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('__average__')
  })

  it('renders all cars in the selector', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Average Car')).toBeInTheDocument()
    })
    expect(screen.getByText('My Corolla')).toBeInTheDocument()
  })

  it('shows fuel prices', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Fuel prices')).toBeInTheDocument()
    })
    expect(screen.getByText('Petrol')).toBeInTheDocument()
    expect(screen.getByText('Diesel')).toBeInTheDocument()
    expect(screen.getByText('Electric')).toBeInTheDocument()
  })

  it('shows Edit button for unlocked cars', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })

  it('does not show Edit button for locked cars', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: '__average__' }))

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Active car')).toBeInTheDocument()
    })
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('calls onEditCar with the car id when Edit is clicked', async () => {
    const onEditCar = vi.fn()
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))

    render(
      withQueryProvider(() => (
        <Home
          onAddCar={() => {}}
          onEditCar={onEditCar}
          onSettings={() => {}}
          onHistory={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Edit'))
    expect(onEditCar).toHaveBeenCalledWith('car-1')
  })

  it('calls onAddCar when Add a car is clicked', async () => {
    const onAddCar = vi.fn()
    mockGetAppState.mockResolvedValue(createMockState())

    render(
      withQueryProvider(() => (
        <Home
          onAddCar={onAddCar}
          onEditCar={() => {}}
          onSettings={() => {}}
          onHistory={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Add a car')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add a car'))
    expect(onAddCar).toHaveBeenCalledOnce()
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

    render(
      withQueryProvider(() => (
        <Home
          onAddCar={onAddCar}
          onEditCar={() => {}}
          onSettings={() => {}}
          onHistory={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Add a car')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add a car'))
    expect(alertSpy).toHaveBeenCalledWith('Upgrade to Pro for unlimited car profiles')
    expect(onAddCar).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })

  it('calls setActiveCarId when a car is selected', async () => {
    const state = createMockState()
    mockGetAppState.mockResolvedValue(state)
    mockSetActiveCarId.mockResolvedValue(undefined)

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'car-1' } })
    expect(mockSetActiveCarId).toHaveBeenCalledWith('car-1')
  })

  it('shows car summary for the active car', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: 'car-1' }))

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText(/Toyota Corolla/)).toBeInTheDocument()
    })
  })

  it('shows fleet average text for the default car', async () => {
    mockGetAppState.mockResolvedValue(createMockState({ activeCarId: '__average__' }))

    render(
      withQueryProvider(() => (
        <Home onAddCar={() => {}} onEditCar={() => {}} onSettings={() => {}} onHistory={() => {}} />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('Fleet average for your region')).toBeInTheDocument()
    })
  })
})
