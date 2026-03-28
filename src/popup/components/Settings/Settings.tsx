import { createSignal, Show, type Component } from 'solid-js'
import { createQuery, useQueryClient } from '@tanstack/solid-query'
import * as s from './Settings.css'
import { getAppState, updateSettings, updateFuelPrices } from '@utils/storage'
import { AVERAGE_CAR_ID, type Currency, type DistanceUnit, type EfficiencyUnit } from '@utils/types'
import { fetchFuelPrices } from '@utils/fuelPrices'
import { AnalyticsEvents, isOptedOut, setOptOut } from '@utils/analytics'
import { useI18n, substitute } from '@utils/i18n'

interface SettingsProps {
  onBack: () => void
}

export const Settings: Component<SettingsProps> = () => {
  const i18n = useI18n()
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
      source: i18n['Manual override'],
      lastUpdated: Date.now(),
    })
    await refreshState()
  }

  const formatLastUpdated = (ts: number): string => {
    if (!ts) return i18n['Never']
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHrs = Math.floor(diffMs / 3600000)
    if (diffHrs < 1) return i18n['Just now']
    if (diffHrs < 24) return substitute(i18n['{{hours}}h ago'], { hours: String(diffHrs) })
    return d.toLocaleDateString()
  }

  return (
    <Show when={state()} fallback={<div class={s.container}>{i18n['Loading...']}</div>}>
      {(appState) => (
        <div class={s.container}>
          <div class={s.pageHeader}>
            <h1 class={s.pageTitle}>{i18n['System Config']}</h1>
            <p class={s.pageSubtitle}>{i18n['Fine-tune your navigation experience']}</p>
          </div>

          <div class={s.unitsGrid}>
            <div class={s.unitCard}>
              <div class={s.unitCardHeader}>
                <span class={`material-symbols-outlined ${s.iconColorPrimary}`}>distance</span>
                <span class={s.unitCardTitle}>{i18n['Distance']}</span>
              </div>
              <div class={s.segmentedControl}>
                <button
                  class={`${s.segmentButton} ${appState().settings.distanceUnit === 'km' ? s.segmentButtonActive : ''}`}
                  onClick={() => handleDistanceUnit('km')}
                >
                  {i18n['KM']}
                </button>
                <button
                  class={`${s.segmentButton} ${appState().settings.distanceUnit === 'miles' ? s.segmentButtonActive : ''}`}
                  onClick={() => handleDistanceUnit('miles')}
                >
                  {i18n['MI']}
                </button>
              </div>
            </div>

            <div class={s.unitCard}>
              <div class={s.unitCardHeader}>
                <span class={`material-symbols-outlined ${s.iconColorTertiary}`}>speed</span>
                <span class={s.unitCardTitle}>{i18n['Efficiency']}</span>
              </div>
              <select
                class={s.select}
                value={appState().settings.efficiencyUnit}
                onChange={(e) => handleEfficiencyUnit(e.currentTarget.value as EfficiencyUnit)}
              >
                <option value="l100km">{i18n['L/100km']}</option>
                <option value="mpg">{i18n['MPG']}</option>
                <option value="kwh100km">{i18n['kWh/100km']}</option>
              </select>
            </div>
          </div>

          <div class={s.section}>
            <div class={s.row}>
              <div class={s.rowInfo}>
                <div class={`${s.rowIcon} ${s.rowIconBgSecondary}`}>
                  <span class={`material-symbols-outlined ${s.iconColorSecondary}`}>payments</span>
                </div>
                <div class={s.rowText}>
                  <span class={s.label}>{i18n['Currency']}</span>
                  <span class={s.sublabel}>{i18n['Used for all cost projections']}</span>
                </div>
              </div>
              <select
                class={`${s.select} ${s.selectPrimary}`}
                value={appState().settings.currency}
                onChange={(e) => handleCurrency(e.currentTarget.value as Currency)}
              >
                <option value="AUD">{i18n['AUD ($)']}</option>
                <option value="USD">{i18n['USD ($)']}</option>
                <option value="GBP">{i18n['GBP (£)']}</option>
                <option value="EUR">{i18n['EUR (€)']}</option>
                <option value="NZD">{i18n['NZD ($)']}</option>
                <option value="CAD">{i18n['CAD ($)']}</option>
                <option value="INR">{i18n['INR (₹)']}</option>
                <option value="JPY">{i18n['JPY (¥)']}</option>
              </select>
            </div>

            <div class={s.divider} />

            <div class={s.row}>
              <div class={s.rowInfo}>
                <div class={`${s.rowIcon} ${s.rowIconBgPrimary}`}>
                  <span class={`material-symbols-outlined ${s.iconColorPrimary}`}>monitoring</span>
                </div>
                <div class={s.rowText}>
                  <span class={s.label}>{i18n['Average Comparison']}</span>
                  <span class={s.sublabel}>{i18n['Show trip efficiency vs average']}</span>
                </div>
              </div>
              <button
                class={`${s.toggle} ${appState().settings.showAverageComparison && !isAverageActive() ? s.toggleActive : ''} ${isAverageActive() ? s.toggleDisabled : ''}`}
                onClick={handleToggleComparison}
                disabled={isAverageActive()}
                aria-label={i18n['Toggle average comparison']}
              >
                <div
                  class={`${s.toggleKnob} ${appState().settings.showAverageComparison && !isAverageActive() ? s.toggleKnobActive : ''}`}
                />
              </button>
            </div>
            <Show when={isAverageActive()}>
              <span class={s.hint}>
                {i18n['Switch to a custom car to compare against the average']}
              </span>
            </Show>
          </div>

          <div class={s.section}>
            <div class={s.pricesHeader}>
              <span class={`material-symbols-outlined ${s.iconColorTertiary}`}>
                local_gas_station
              </span>
              <span class={s.pricesTitle}>{i18n['Market Rates']}</span>
            </div>

            <div class={s.pricesListColumn}>
              <div class={`${s.priceRow} ${s.priceRowPetrol}`}>
                <span class={s.priceLabel}>{i18n['Petrol (95)']}</span>
                <div class={s.priceInputGroup}>
                  <span class={s.priceUnit}>{i18n['per L']}</span>
                  <input
                    class={`${s.priceInput} ${s.priceInputPetrol}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={appState().fuelPrices.petrolPerLitre}
                    onChange={(e) => handlePriceChange('petrolPerLitre', e.currentTarget.value)}
                  />
                </div>
              </div>
              <div class={`${s.priceRow} ${s.priceRowDiesel}`}>
                <span class={s.priceLabel}>{i18n['Diesel']}</span>
                <div class={s.priceInputGroup}>
                  <span class={s.priceUnit}>{i18n['per L']}</span>
                  <input
                    class={`${s.priceInput} ${s.priceInputDiesel}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={appState().fuelPrices.dieselPerLitre}
                    onChange={(e) => handlePriceChange('dieselPerLitre', e.currentTarget.value)}
                  />
                </div>
              </div>
              <div class={`${s.priceRow} ${s.priceRowElectric}`}>
                <span class={s.priceLabel}>{i18n['Electric']}</span>
                <div class={s.priceInputGroup}>
                  <span class={s.priceUnit}>{i18n['per kWh']}</span>
                  <input
                    class={`${s.priceInput} ${s.priceInputElectric}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={appState().fuelPrices.electricityPerKwh}
                    onChange={(e) => handlePriceChange('electricityPerKwh', e.currentTarget.value)}
                  />
                </div>
              </div>
            </div>

            <div class={s.refreshRow}>
              <span class={s.lastUpdated}>
                {appState().fuelPrices.source} ·{' '}
                {formatLastUpdated(appState().fuelPrices.lastUpdated)}
              </span>
              <button class={s.refreshButton} onClick={handleRefreshPrices} disabled={refreshing()}>
                {refreshing() ? i18n['Refreshing...'] : i18n['Refresh']}
              </button>
            </div>
          </div>

          <div class={s.section}>
            <div class={s.row}>
              <div class={s.rowInfo}>
                <div class={`${s.rowIcon} ${s.rowIconBgError}`}>
                  <span class={`material-symbols-outlined ${s.iconColorError}`}>
                    shield_with_heart
                  </span>
                </div>
                <div class={s.rowText}>
                  <span class={s.label}>{i18n['Anonymous Analytics']}</span>
                  <span class={s.sublabel}>
                    {i18n['Help improve with non-identifiable data']}
                  </span>
                </div>
              </div>
              <button
                class={`${s.toggle} ${analyticsOptOut() ? s.toggleActive : ''}`}
                onClick={handleAnalyticsToggle}
                aria-label={i18n['Toggle analytics opt-out']}
              >
                <div class={`${s.toggleKnob} ${analyticsOptOut() ? s.toggleKnobActive : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Show>
  )
}
