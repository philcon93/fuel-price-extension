import type { TripRecord } from '@utils/types'

const STORAGE_KEY = 'fuelCostTrips'
const MAX_TRIPS = 200
const DEDUP_WINDOW_MS = 30_000

interface StoredTrips {
  trips: TripRecord[]
}

async function loadTrips(): Promise<TripRecord[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  return (result[STORAGE_KEY] as StoredTrips)?.trips ?? []
}

async function saveTrips(trips: TripRecord[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: { trips } })
}

export async function recordTrip(trip: Omit<TripRecord, 'id'>): Promise<void> {
  const trips = await loadTrips()

  const cutoff = trip.timestamp - DEDUP_WINDOW_MS
  const isDuplicate = trips.some(
    (t) =>
      t.timestamp >= cutoff &&
      t.carId === trip.carId &&
      Math.abs(t.distanceKm - trip.distanceKm) < 0.1 &&
      Math.abs(t.fuelCost - trip.fuelCost) < 0.01,
  )

  if (isDuplicate) return

  const newTrip: TripRecord = { ...trip, id: Date.now() }
  const updated = [newTrip, ...trips].slice(0, MAX_TRIPS)
  await saveTrips(updated)
}

export async function getRecentTrips(limit = 50): Promise<TripRecord[]> {
  const trips = await loadTrips()
  return trips.slice(0, limit)
}

export async function clearTripHistory(): Promise<void> {
  await saveTrips([])
}

export async function getTripStats(): Promise<{
  totalTrips: number
  totalCost: number
  totalDistanceKm: number
}> {
  const trips = await loadTrips()
  return {
    totalTrips: trips.length,
    totalCost: trips.reduce((sum, t) => sum + t.fuelCost, 0),
    totalDistanceKm: trips.reduce((sum, t) => sum + t.distanceKm, 0),
  }
}
