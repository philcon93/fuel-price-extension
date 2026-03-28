import Dexie, { type EntityTable } from 'dexie'
import type { TripRecord } from '@utils/types'

const db = new Dexie('FuelCostTrips') as Dexie & {
  trips: EntityTable<TripRecord, 'id'>
}

db.version(1).stores({
  trips: '++id, timestamp, carId',
})

const DEDUP_WINDOW_MS = 30_000

export async function recordTrip(trip: Omit<TripRecord, 'id'>): Promise<void> {
  const cutoff = trip.timestamp - DEDUP_WINDOW_MS
  const recent = await db.trips
    .where('timestamp')
    .aboveOrEqual(cutoff)
    .filter(
      (t) =>
        t.carId === trip.carId &&
        Math.abs(t.distanceKm - trip.distanceKm) < 0.1 &&
        Math.abs(t.fuelCost - trip.fuelCost) < 0.01,
    )
    .first()

  if (recent) return

  await db.trips.add(trip)
}

export async function getRecentTrips(limit = 50): Promise<TripRecord[]> {
  return db.trips.orderBy('timestamp').reverse().limit(limit).toArray()
}

export async function clearTripHistory(): Promise<void> {
  await db.trips.clear()
}

export async function getTripStats(): Promise<{
  totalTrips: number
  totalCost: number
  totalDistanceKm: number
}> {
  const trips = await db.trips.toArray()
  return {
    totalTrips: trips.length,
    totalCost: trips.reduce((sum, t) => sum + t.fuelCost, 0),
    totalDistanceKm: trips.reduce((sum, t) => sum + t.distanceKm, 0),
  }
}
