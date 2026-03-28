import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { CarSearch } from './CarSearch'
import type { AppState } from '@utils/types'

const mockSearchCars = vi.fn()
const mockGetAppState = vi.fn<() => Promise<AppState>>()
const mockAddCar = vi.fn()
const mockRemoveCar = vi.fn()

vi.mock('@utils/carLookup', () => ({
  searchCars: (...args: unknown[]) => mockSearchCars(...args),
}))

vi.mock('@utils/storage', () => ({
  getAppState: (...args: unknown[]) => mockGetAppState(...(args as [])),
  addCar: (...args: unknown[]) => mockAddCar(...args),
  removeCar: (...args: unknown[]) => mockRemoveCar(...args),
}))

function createMockState(): AppState {
  return {
    cars: [
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
    activeCarId: 'car-1',
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
})

describe('CarSearch', () => {
  it('renders search input when not in edit mode', () => {
    render(() => <CarSearch onDone={() => {}} />)
    expect(screen.getByPlaceholderText(/Search e\.g\./)).toBeInTheDocument()
  })

  it('shows "Enter manually" toggle', () => {
    render(() => <CarSearch onDone={() => {}} />)
    expect(screen.getByText('Enter manually')).toBeInTheDocument()
  })

  it('toggles to manual entry mode', () => {
    render(() => <CarSearch onDone={() => {}} />)
    fireEvent.click(screen.getByText('Enter manually'))
    expect(screen.getByText('Search instead')).toBeInTheDocument()
  })

  describe('debounced search', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not search for queries shorter than 2 characters', async () => {
      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 't' } })

      await vi.advanceTimersByTimeAsync(500)
      expect(mockSearchCars).not.toHaveBeenCalled()
    })

    it('searches after debounce delay', async () => {
      mockSearchCars.mockResolvedValue([
        { makeDisplay: 'Toyota', modelName: 'Corolla', modelYear: 2023, trimCount: 3 },
      ])

      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 'toyota' } })

      expect(mockSearchCars).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(500)
      expect(mockSearchCars).toHaveBeenCalledWith('toyota')
    })

    it('displays search results', async () => {
      mockSearchCars.mockResolvedValue([
        { makeDisplay: 'Toyota', modelName: 'Corolla', modelYear: 2023, trimCount: 3 },
        { makeDisplay: 'Toyota', modelName: 'Camry', modelYear: 2023, trimCount: 2 },
      ])

      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 'toyota' } })
      await vi.advanceTimersByTimeAsync(500)

      await waitFor(() => {
        expect(screen.getByText('Toyota Corolla')).toBeInTheDocument()
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument()
      })
    })

    it('shows "No results found" for empty search results', async () => {
      mockSearchCars.mockResolvedValue([])

      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 'zzz' } })
      await vi.advanceTimersByTimeAsync(500)

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument()
      })
    })

    it('shows "Searching..." while loading', async () => {
      mockSearchCars.mockReturnValue(new Promise(() => {}))

      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 'toyota' } })
      await vi.advanceTimersByTimeAsync(500)

      await waitFor(() => {
        expect(screen.getByText('Searching...')).toBeInTheDocument()
      })
    })

    it('shows trim count in result metadata', async () => {
      mockSearchCars.mockResolvedValue([
        { makeDisplay: 'Toyota', modelName: 'Corolla', modelYear: 2023, trimCount: 3 },
      ])

      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 'toyota' } })
      await vi.advanceTimersByTimeAsync(500)

      await waitFor(() => {
        expect(screen.getByText('2023 · 3 trims')).toBeInTheDocument()
      })
    })

    it('handles singular trim count', async () => {
      mockSearchCars.mockResolvedValue([
        { makeDisplay: 'Honda', modelName: 'Civic', modelYear: 2024, trimCount: 1 },
      ])

      render(() => <CarSearch onDone={() => {}} />)
      const input = screen.getByPlaceholderText(/Search e\.g\./)
      fireEvent.input(input, { target: { value: 'honda' } })
      await vi.advanceTimersByTimeAsync(500)

      await waitFor(() => {
        expect(screen.getByText('2024 · 1 trim')).toBeInTheDocument()
      })
    })
  })

  it('shows manual entry and delete in edit mode', async () => {
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <CarSearch editCarId="car-1" onDone={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Delete this car')).toBeInTheDocument()
    })
  })

  it('calls removeCar and onDone when delete is confirmed', async () => {
    const onDone = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockGetAppState.mockResolvedValue(createMockState())
    mockRemoveCar.mockResolvedValue(undefined)

    render(() => <CarSearch editCarId="car-1" onDone={onDone} />)

    await waitFor(() => {
      expect(screen.getByText('Delete this car')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Delete this car'))
    expect(confirmSpy).toHaveBeenCalledWith('Delete this car profile?')

    await waitFor(() => {
      expect(mockRemoveCar).toHaveBeenCalledWith('car-1')
      expect(onDone).toHaveBeenCalledOnce()
    })

    confirmSpy.mockRestore()
  })

  it('does not delete when confirm is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    mockGetAppState.mockResolvedValue(createMockState())

    render(() => <CarSearch editCarId="car-1" onDone={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Delete this car')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Delete this car'))
    expect(mockRemoveCar).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })
})
