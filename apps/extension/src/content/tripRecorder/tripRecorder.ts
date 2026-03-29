import type { TripRecord } from '@utils/types'

export const TRIP_STORAGE_KEY = 'fuelCostTrips'
export const MAX_TRIPS = 200
export const DEDUP_WINDOW_MS = 30_000
export const TRIP_FLUSH_DELAY_MS = 1_000

export async function recordTripToStorage(trip: Omit<TripRecord, 'id'>): Promise<void> {
  try {
    const result = await chrome.storage.local.get(TRIP_STORAGE_KEY)
    const stored = result[TRIP_STORAGE_KEY] as { trips?: TripRecord[] } | undefined
    const existing: TripRecord[] = stored?.trips ?? []

    const cutoff = trip.timestamp - DEDUP_WINDOW_MS
    const isDuplicate = existing.some(
      (t) =>
        t.timestamp >= cutoff &&
        t.carId === trip.carId &&
        Math.abs(t.distanceKm - trip.distanceKm) < 0.1 &&
        Math.abs(t.fuelCost - trip.fuelCost) < 0.01,
    )
    if (isDuplicate) return

    const newTrip: TripRecord = { ...trip, id: Date.now() }
    const updated = [newTrip, ...existing].slice(0, MAX_TRIPS)
    await chrome.storage.local.set({ [TRIP_STORAGE_KEY]: { trips: updated } })
  } catch {
    // Non-critical — trip recording failure shouldn't break the UI
  }
}

const pendingTrips = new Map<string, Omit<TripRecord, 'id'>>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

export function queueTrip(trip: Omit<TripRecord, 'id'>): void {
  const existing = pendingTrips.get(trip.carId)
  if (!existing || trip.distanceKm > existing.distanceKm) {
    pendingTrips.set(trip.carId, trip)
  }

  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(flushPendingTrips, TRIP_FLUSH_DELAY_MS)
}

async function flushPendingTrips(): Promise<void> {
  const trips = Array.from(pendingTrips.values())
  pendingTrips.clear()
  for (const trip of trips) {
    await recordTripToStorage(trip)
  }
}
