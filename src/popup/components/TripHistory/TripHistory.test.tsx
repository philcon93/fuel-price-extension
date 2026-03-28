import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { TripHistory } from './TripHistory'
import { getChromeMock } from '../../../test-setup'
import type { TripRecord } from '@utils/types'

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
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockReturnValue(new Promise(() => {}))

    render(() => <TripHistory />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows empty state when no trips recorded', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 })

    render(() => <TripHistory />)

    await waitFor(() => {
      expect(screen.getByText(/No trips recorded yet/)).toBeInTheDocument()
    })
  })

  it('displays trip stats', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage
      .mockResolvedValueOnce([createMockTrip()])
      .mockResolvedValueOnce({ totalTrips: 5, totalCost: 22.5, totalDistanceKm: 130 })

    render(() => <TripHistory />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Trips')).toBeInTheDocument()
      expect(screen.getByText('Total cost')).toBeInTheDocument()
      expect(screen.getByText('Distance')).toBeInTheDocument()
    })
  })

  it('renders trip list items', async () => {
    const mock = getChromeMock()
    const trips = [
      createMockTrip({ carNickname: 'My Corolla', distanceKm: 25.3, fuelCost: 4.5 }),
      createMockTrip({
        id: 2,
        carNickname: 'Family SUV',
        distanceKm: 10.0,
        fuelCost: 2.1,
      }),
    ]
    mock.runtime.sendMessage
      .mockResolvedValueOnce(trips)
      .mockResolvedValueOnce({ totalTrips: 2, totalCost: 6.6, totalDistanceKm: 35.3 })

    render(() => <TripHistory />)

    await waitFor(() => {
      expect(screen.getByText('My Corolla')).toBeInTheDocument()
      expect(screen.getByText('Family SUV')).toBeInTheDocument()
    })
  })

  it('shows clear history button when trips exist', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage
      .mockResolvedValueOnce([createMockTrip()])
      .mockResolvedValueOnce({ totalTrips: 1, totalCost: 4.5, totalDistanceKm: 25.3 })

    render(() => <TripHistory />)

    await waitFor(() => {
      expect(screen.getByText('Clear history')).toBeInTheDocument()
    })
  })

  it('clears trip history on confirm', async () => {
    const mock = getChromeMock()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    mock.runtime.sendMessage
      .mockResolvedValueOnce([createMockTrip()])
      .mockResolvedValueOnce({ totalTrips: 1, totalCost: 4.5, totalDistanceKm: 25.3 })

    render(() => <TripHistory />)

    await waitFor(() => {
      expect(screen.getByText('Clear history')).toBeInTheDocument()
    })

    mock.runtime.sendMessage.mockResolvedValueOnce(true)
    fireEvent.click(screen.getByText('Clear history'))

    expect(confirmSpy).toHaveBeenCalledWith('Clear all trip history?')

    await waitFor(() => {
      expect(screen.getByText(/No trips recorded yet/)).toBeInTheDocument()
    })

    confirmSpy.mockRestore()
  })
})
