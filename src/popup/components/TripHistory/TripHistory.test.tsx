import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { TripHistory } from './TripHistory'
import { withQueryProvider } from '../../../test-setup'
import type { TripRecord } from '@utils/types'

const mockGetRecentTrips = vi.fn<() => Promise<TripRecord[]>>()
const mockGetTripStats = vi.fn()
const mockClearTripHistory = vi.fn()

vi.mock('@utils/tripHistory', () => ({
  getRecentTrips: (...args: unknown[]) => mockGetRecentTrips(...(args as [])),
  getTripStats: (...args: unknown[]) => mockGetTripStats(...(args as [])),
  clearTripHistory: (...args: unknown[]) => mockClearTripHistory(...(args as [])),
}))

function createMockTrip(overrides?: Partial<TripRecord>): TripRecord {
  return {
    id: 1,
    timestamp: Date.now() - 60000,
    distanceKm: 25.3,
    fuelCost: 4.5,
    carId: 'car-1',
    carNickname: 'My Corolla',
    fuelType: 'petrol',
    currency: 'AUD',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TripHistory', () => {
  it('shows loading state initially', () => {
    mockGetRecentTrips.mockReturnValue(new Promise(() => {}))
    mockGetTripStats.mockReturnValue(new Promise(() => {}))

    render(withQueryProvider(() => <TripHistory />))
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state when no trips recorded', async () => {
    mockGetRecentTrips.mockResolvedValue([])
    mockGetTripStats.mockResolvedValue({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 })

    render(withQueryProvider(() => <TripHistory />))

    await waitFor(() => {
      expect(screen.getByText(/No trips recorded yet/)).toBeInTheDocument()
    })
  })

  it('displays trip stats', async () => {
    mockGetRecentTrips.mockResolvedValue([createMockTrip()])
    mockGetTripStats.mockResolvedValue({ totalTrips: 5, totalCost: 22.5, totalDistanceKm: 130 })

    render(withQueryProvider(() => <TripHistory />))

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Trips')).toBeInTheDocument()
      expect(screen.getByText('Total cost')).toBeInTheDocument()
      expect(screen.getByText('Distance')).toBeInTheDocument()
    })
  })

  it('renders trip list items', async () => {
    const trips = [
      createMockTrip({ carNickname: 'My Corolla', distanceKm: 25.3, fuelCost: 4.5 }),
      createMockTrip({
        id: 2,
        carNickname: 'Family SUV',
        distanceKm: 10.0,
        fuelCost: 2.1,
      }),
    ]
    mockGetRecentTrips.mockResolvedValue(trips)
    mockGetTripStats.mockResolvedValue({ totalTrips: 2, totalCost: 6.6, totalDistanceKm: 35.3 })

    render(withQueryProvider(() => <TripHistory />))

    await waitFor(() => {
      expect(screen.getByText('My Corolla')).toBeInTheDocument()
      expect(screen.getByText('Family SUV')).toBeInTheDocument()
    })
  })

  it('shows clear history button when trips exist', async () => {
    mockGetRecentTrips.mockResolvedValue([createMockTrip()])
    mockGetTripStats.mockResolvedValue({ totalTrips: 1, totalCost: 4.5, totalDistanceKm: 25.3 })

    render(withQueryProvider(() => <TripHistory />))

    await waitFor(() => {
      expect(screen.getByText('Clear history')).toBeInTheDocument()
    })
  })

  it('clears trip history on confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockGetRecentTrips.mockResolvedValue([createMockTrip()])
    mockGetTripStats.mockResolvedValue({ totalTrips: 1, totalCost: 4.5, totalDistanceKm: 25.3 })
    mockClearTripHistory.mockResolvedValue(undefined)

    render(withQueryProvider(() => <TripHistory />))

    await waitFor(() => {
      expect(screen.getByText('Clear history')).toBeInTheDocument()
    })

    mockGetRecentTrips.mockResolvedValue([])
    mockGetTripStats.mockResolvedValue({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 })

    fireEvent.click(screen.getByText('Clear history'))
    expect(confirmSpy).toHaveBeenCalledWith('Clear all trip history?')

    await waitFor(() => {
      expect(mockClearTripHistory).toHaveBeenCalledOnce()
      expect(screen.getByText(/No trips recorded yet/)).toBeInTheDocument()
    })

    confirmSpy.mockRestore()
  })
})
