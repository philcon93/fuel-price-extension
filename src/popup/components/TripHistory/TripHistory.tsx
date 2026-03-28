import { createSignal, onMount, For, Show, type Component } from 'solid-js'
import * as s from './TripHistory.css'
import type { TripRecord } from '@utils/types'
import { formatCost } from '@utils/calculator'
import type { Currency } from '@utils/types'

export const TripHistory: Component = () => {
  const [trips, setTrips] = createSignal<TripRecord[]>([])
  const [stats, setStats] = createSignal({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 })
  const [loading, setLoading] = createSignal(true)

  const loadData = async () => {
    try {
      const [tripData, statsData] = await Promise.all([
        chrome.runtime.sendMessage({ type: 'GET_TRIP_HISTORY', limit: 50 }),
        chrome.runtime.sendMessage({ type: 'GET_TRIP_STATS' }),
      ])
      setTrips(tripData ?? [])
      setStats(statsData ?? { totalTrips: 0, totalCost: 0, totalDistanceKm: 0 })
    } finally {
      setLoading(false)
    }
  }

  onMount(loadData)

  const handleClear = async () => {
    if (!confirm('Clear all trip history?')) return
    await chrome.runtime.sendMessage({ type: 'CLEAR_TRIP_HISTORY' })
    setTrips([])
    setStats({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 })
  }

  const formatDate = (ts: number): string => {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    return d.toLocaleDateString()
  }

  const formatDistance = (km: number): string => {
    if (km < 1) return `${Math.round(km * 1000)}m`
    return `${km.toFixed(1)} km`
  }

  const defaultCurrency = (): Currency => {
    const t = trips()
    return t.length > 0 ? t[0].currency : 'AUD'
  }

  return (
    <Show when={!loading()} fallback={<div class={s.container}>Loading...</div>}>
      <div class={s.container}>
        <Show
          when={stats().totalTrips > 0}
          fallback={
            <div class={s.emptyState}>
              No trips recorded yet. Navigate on Google Maps to see your fuel cost history here.
            </div>
          }
        >
          <div class={s.statsGrid}>
            <div class={s.statCard}>
              <span class={s.statValue}>{stats().totalTrips}</span>
              <span class={s.statLabel}>Trips</span>
            </div>
            <div class={s.statCard}>
              <span class={s.statValue}>{formatCost(stats().totalCost, defaultCurrency())}</span>
              <span class={s.statLabel}>Total cost</span>
            </div>
            <div class={s.statCard}>
              <span class={s.statValue}>{formatDistance(stats().totalDistanceKm)}</span>
              <span class={s.statLabel}>Distance</span>
            </div>
          </div>

          <div class={s.headerRow}>
            <span class={s.sectionLabel}>Recent trips</span>
            <button class={s.clearButton} onClick={handleClear}>
              Clear history
            </button>
          </div>

          <div class={s.tripList}>
            <For each={trips()}>
              {(trip) => (
                <div class={s.tripItem}>
                  <div class={s.tripDetails}>
                    <span class={s.tripCar}>{trip.carNickname}</span>
                    <span class={s.tripMeta}>
                      {formatDistance(trip.distanceKm)} · {formatDate(trip.timestamp)}
                    </span>
                  </div>
                  <span class={s.tripCost}>{formatCost(trip.fuelCost, trip.currency)}</span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  )
}
