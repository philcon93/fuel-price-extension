import { createSignal, Show, type Component } from 'solid-js'
import { createQuery, useQueryClient } from '@tanstack/solid-query'
import * as s from './Settings.css'
import { getAppState, updateSettings, updateFuelPrices } from '@utils/storage'
import {
  AVERAGE_CAR_ID,
  type Currency,
  type DistanceUnit,
  type EfficiencyUnit,
} from '@utils/types'
import { fetchFuelPrices } from '@utils/fuelPrices'
import { AnalyticsEvents, isOptedOut, setOptOut } from '@utils/analytics'

interface SettingsProps {
  onBack: () => void
}

export const Settings: Component<SettingsProps> = () => {
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = createSignal(false)
  const [analyticsOptOut, setAnalyticsOptOut] = createSignal(false)

  const stateQuery = createQuery(() => ({
    queryKey: ['appState'] as const,
    queryFn: getAppState,
  }))

  const state = () => stateQuery.data ?? null

  isOptedOut().then(setAnalyticsOptOut)

  const isAverageActive = () => state()?.activeCarId === AVERAGE_CAR_ID

  const refreshState = () => queryClient.invalidateQueries({ queryKey: ['appState'] })

  const handleDistanceUnit = async (unit: DistanceUnit) => {
    await updateSettings({ distanceUnit: unit })
    await refreshState()
    AnalyticsEvents.settingsChanged('distanceUnit', unit)
  }

  const handleEfficiencyUnit = async (unit: EfficiencyUnit) => {
    await updateSettings({ efficiencyUnit: unit })
    await refreshState()
    AnalyticsEvents.settingsChanged('efficiencyUnit', unit)
  }

  const handleCurrency = async (currency: Currency) => {
    await updateSettings({ currency })
    await refreshState()
    AnalyticsEvents.settingsChanged('currency', currency)
  }

  const handleToggleComparison = async () => {
    if (isAverageActive()) return
    const current = state()?.settings.showAverageComparison ?? true
    await updateSettings({ showAverageComparison: !current })
    await refreshState()
    AnalyticsEvents.settingsChanged('showAverageComparison', String(!current))
  }

  const handleAnalyticsToggle = async () => {
    const newValue = !analyticsOptOut()
    setAnalyticsOptOut(newValue)
    await setOptOut(newValue)
  }

  const handleRefreshPrices = async () => {
    setRefreshing(true)
    try {
      const prices = await fetchFuelPrices(true)
      await updateFuelPrices(prices)
      await refreshState()
    } catch (e) {
      console.error('[Fuel Cost] Refresh failed:', e)
    } finally {
      setRefreshing(false)
    }
  }

  const handlePriceChange = async (
    field: 'petrolPerLitre' | 'dieselPerLitre' | 'electricityPerKwh',
    value: string,
  ) => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0) return
    const current = state()?.fuelPrices
    if (!current) return
    await updateFuelPrices({
      ...current,
      [field]: num,
      source: 'Manual override',
      lastUpdated: Date.now(),
    })
    await refreshState()
  }

  const formatLastUpdated = (ts: number): string => {
    if (!ts) return 'Never'
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHrs = Math.floor(diffMs / 3600000)
    if (diffHrs < 1) return 'Just now'
    if (diffHrs < 24) return `${diffHrs}h ago`
    return d.toLocaleDateString()
  }

  return (
    <Show when={state()} fallback={<div class={s.container}>Loading...</div>}>
      {(appState) => (
        <div class={s.container}>
          <div class={s.section}>
            <span class={s.sectionTitle}>Units</span>
            <div class={s.row}>
              <span class={s.label}>Distance</span>
              <select
                class={s.select}
                value={appState().settings.distanceUnit}
                onChange={(e) => handleDistanceUnit(e.currentTarget.value as DistanceUnit)}
              >
                <option value="km">Kilometres</option>
                <option value="miles">Miles</option>
              </select>
            </div>
            <div class={s.row}>
              <span class={s.label}>Fuel efficiency</span>
              <select
                class={s.select}
                value={appState().settings.efficiencyUnit}
                onChange={(e) => handleEfficiencyUnit(e.currentTarget.value as EfficiencyUnit)}
              >
                <option value="l100km">L/100km</option>
                <option value="mpg">MPG</option>
                <option value="kwh100km">kWh/100km</option>
              </select>
            </div>
          </div>

          <div class={s.section}>
            <span class={s.sectionTitle}>Currency</span>
            <div class={s.row}>
              <span class={s.label}>Currency</span>
              <select
                class={s.select}
                value={appState().settings.currency}
                onChange={(e) => handleCurrency(e.currentTarget.value as Currency)}
              >
                <option value="AUD">AUD ($)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="NZD">NZD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>

          <div class={s.section}>
            <span class={s.sectionTitle}>Display</span>
            <div class={s.row}>
              <span class={s.label}>Show average comparison</span>
              <button
                class={`${s.toggle} ${appState().settings.showAverageComparison && !isAverageActive() ? s.toggleActive : ''} ${isAverageActive() ? s.toggleDisabled : ''}`}
                onClick={handleToggleComparison}
                disabled={isAverageActive()}
                aria-label="Toggle average comparison"
              >
                <div
                  class={`${s.toggleKnob} ${appState().settings.showAverageComparison && !isAverageActive() ? s.toggleKnobActive : ''}`}
                />
              </button>
            </div>
            <Show when={isAverageActive()}>
              <span class={s.hint}>Switch to a custom car to compare against the average</span>
            </Show>
          </div>

          <div class={s.section}>
            <span class={s.sectionTitle}>Fuel prices</span>
            <div class={s.priceRow}>
              <span class={s.label}>Petrol (per L)</span>
              <input
                class={s.priceInput}
                type="number"
                step="0.01"
                min="0"
                value={appState().fuelPrices.petrolPerLitre}
                onChange={(e) => handlePriceChange('petrolPerLitre', e.currentTarget.value)}
              />
            </div>
            <div class={s.priceRow}>
              <span class={s.label}>Diesel (per L)</span>
              <input
                class={s.priceInput}
                type="number"
                step="0.01"
                min="0"
                value={appState().fuelPrices.dieselPerLitre}
                onChange={(e) => handlePriceChange('dieselPerLitre', e.currentTarget.value)}
              />
            </div>
            <div class={s.priceRow}>
              <span class={s.label}>Electricity (per kWh)</span>
              <input
                class={s.priceInput}
                type="number"
                step="0.01"
                min="0"
                value={appState().fuelPrices.electricityPerKwh}
                onChange={(e) => handlePriceChange('electricityPerKwh', e.currentTarget.value)}
              />
            </div>
            <div class={s.row}>
              <span class={s.lastUpdated}>
                {appState().fuelPrices.source} ·{' '}
                {formatLastUpdated(appState().fuelPrices.lastUpdated)}
              </span>
              <button class={s.refreshButton} onClick={handleRefreshPrices} disabled={refreshing()}>
                {refreshing() ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div class={s.section}>
            <span class={s.sectionTitle}>Privacy</span>
            <div class={s.row}>
              <span class={s.label}>Disable anonymous analytics</span>
              <button
                class={`${s.toggle} ${analyticsOptOut() ? s.toggleActive : ''}`}
                onClick={handleAnalyticsToggle}
                aria-label="Toggle analytics opt-out"
              >
                <div class={`${s.toggleKnob} ${analyticsOptOut() ? s.toggleKnobActive : ''}`} />
              </button>
            </div>
            <span class={s.hint}>
              We collect anonymous usage data to improve the extension. No personal data or
              locations are ever sent.
            </span>
          </div>
        </div>
      )}
    </Show>
  )
}
