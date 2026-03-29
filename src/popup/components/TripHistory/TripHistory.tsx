import { For, Show, type Component } from 'solid-js'
import { createQuery, useQueryClient } from '@tanstack/solid-query'
import * as s from './TripHistory.css'
import type { TripRecord } from '@utils/types'
import { formatCost } from '@utils/calculator'
import type { Currency } from '@utils/types'
import { getRecentTrips, getTripStats, clearTripHistory } from '@utils/tripHistory'
import { useI18n, substitute } from '@utils/i18n'

export const TripHistory: Component = () => {
  const i18n = useI18n()
  const queryClient = useQueryClient()

  const tripsQuery = createQuery(() => ({
    queryKey: ['tripHistory'] as const,
    queryFn: () => getRecentTrips(50),
  }))

  const statsQuery = createQuery(() => ({
    queryKey: ['tripStats'] as const,
    queryFn: getTripStats,
  }))

  const trips = () => tripsQuery.data ?? []
  const stats = () => statsQuery.data ?? { totalTrips: 0, totalCost: 0, totalDistanceKm: 0 }
  const loading = () => tripsQuery.isLoading || statsQuery.isLoading

  const handleClear = async () => {
    if (!confirm(i18n['Clear all trip history?'])) return
    await clearTripHistory()
    await queryClient.invalidateQueries({ queryKey: ['tripHistory'] })
    await queryClient.invalidateQueries({ queryKey: ['tripStats'] })
  }

  const formatDate = (ts: number): string => {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return i18n['Just now']
    if (diffMins < 60) return substitute(i18n['{{mins}}m ago'], { mins: String(diffMins) })
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return substitute(i18n['{{hours}}h ago'], { hours: String(diffHrs) })
    return d.toLocaleDateString()
  }

  const formatDistance = (km: number): string => {
    if (km < 1)
      return substitute(i18n['{{distance}}m'], { distance: String(Math.round(km * 1000)) })
    return substitute(i18n['{{distance}} km'], { distance: km.toFixed(1) })
  }

  const defaultCurrency = (): Currency => {
    const t = trips()
    return t.length > 0 ? t[0].currency : 'AUD'
  }

  const fuelIcon = (fuelType: string): string => {
    switch (fuelType) {
      case 'electric':
        return 'bolt'
      case 'diesel':
        return 'oil_barrel'
      default:
        return 'local_gas_station'
    }
  }

  const fuelLabel = (fuelType: string): string => {
    const labels: Record<string, string> = {
      petrol: i18n['Petrol'],
      diesel: i18n['Diesel'],
      hybrid: i18n['Hybrid'],
      phev: i18n['PHEV'],
      electric: i18n['Electric'],
    }
    return labels[fuelType] ?? fuelType
  }

  const fuelVariantKey = (fuelType: string): keyof typeof s.fuelChipVariant =>
    fuelType in s.fuelChipVariant ? (fuelType as keyof typeof s.fuelChipVariant) : 'petrol'

  return (
    <Show when={!loading()} fallback={<div class={s.container}>{i18n['Loading...']}</div>}>
      <div class={s.container}>
        <Show
          when={stats().totalTrips > 0}
          fallback={
            <div class={s.emptyState}>
              {
                i18n[
                  'No trips recorded yet. Navigate on Google Maps to see your fuel cost history here.'
                ]
              }
            </div>
          }
        >
          <div class={s.statsGrid}>
            <div class={`${s.statCard} ${s.statCardPrimary}`}>
              <span class={s.statLabel}>{i18n['Total Trips']}</span>
              <span class={`${s.statValue} ${s.statValuePrimary}`}>{stats().totalTrips}</span>
            </div>
            <div class={`${s.statCard} ${s.statCardSecondary}`}>
              <span class={s.statLabel}>{i18n['Total Spent']}</span>
              <span class={`${s.statValue} ${s.statValueSecondary}`}>
                {formatCost(stats().totalCost, defaultCurrency())}
              </span>
            </div>
            <div class={`${s.statCard} ${s.statCardTertiary}`}>
              <span class={s.statLabel}>{i18n['Total Dist.']}</span>
              <span class={`${s.statValue} ${s.statValueTertiary}`}>
                {stats().totalDistanceKm < 1
                  ? `${Math.round(stats().totalDistanceKm * 1000)}`
                  : stats().totalDistanceKm.toFixed(1)}
                <span class={s.statUnit}>
                  {stats().totalDistanceKm < 1 ? i18n['m'] : i18n['km']}
                </span>
              </span>
            </div>
          </div>

          <div class={s.sectionHeader}>
            <div>
              <h3 class={s.sectionTitle}>{i18n['Recent Activity']}</h3>
              <p class={s.sectionSubtitle}>{i18n['Your kinetic footprint']}</p>
            </div>
            <button class={s.clearButton} onClick={handleClear}>
              <span class={`material-symbols-outlined ${s.iconSm}`}>delete_sweep</span>
              {i18n['Clear History']}
            </button>
          </div>

          <div class={s.tripList}>
            <For each={trips()}>
              {(trip: TripRecord) => {
                const variant = fuelVariantKey(trip.fuelType)
                return (
                  <div class={s.tripCard}>
                    <div class={s.tripCardTop}>
                      <div class={s.tripCardLeft}>
                        <div class={`${s.tripIcon} ${s.tripIconVariant[variant]}`}>
                          <span
                            class={`material-symbols-outlined ${s.tripIconTextVariant[variant]}`}
                          >
                            {fuelIcon(trip.fuelType)}
                          </span>
                        </div>
                        <div class={s.tripInfo}>
                          <span class={s.tripCarName}>{trip.carNickname}</span>
                          <span class={s.tripDate}>{formatDate(trip.timestamp)}</span>
                        </div>
                      </div>
                      <div class={s.tripCostSection}>
                        <div class={s.tripCost}>{formatCost(trip.fuelCost, trip.currency)}</div>
                      </div>
                    </div>
                    <div class={s.tripCardBottom}>
                      <span class={s.tripMeta}>
                        <span class={`material-symbols-outlined ${s.iconSm}`}>route</span>
                        {formatDistance(trip.distanceKm)}
                      </span>
                      <span class={`${s.fuelChip} ${s.fuelChipVariant[variant]}`}>
                        {fuelLabel(trip.fuelType).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )
              }}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  )
}
