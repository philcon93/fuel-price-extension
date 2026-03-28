import { Show, type Component } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import * as s from './Home.css'
import { getAppState } from '@utils/storage'
import type { AppState, CarProfile } from '@utils/types'
import { formatCost } from '@utils/calculator'
import { useI18n, substitute } from '@utils/i18n'

export const Home: Component = () => {
  const i18n = useI18n()

  const stateQuery = createQuery(() => ({
    queryKey: ['appState'] as const,
    queryFn: getAppState,
  }))

  const state = () => stateQuery.data ?? null

  const activeCar = (): CarProfile | undefined =>
    state()?.cars.find((c) => c.id === state()?.activeCarId)

  const formatEfficiency = (car: CarProfile): { value: string; unit: string } | null => {
    if (car.fuelType === 'electric') {
      return car.kWh100km ? { value: String(car.kWh100km), unit: i18n['kWh/100km'] } : null
    }
    const l100km = car.useRealWorld ? car.realWorldL100km : car.officialL100km
    return l100km ? { value: String(l100km), unit: i18n['L/100km'] } : null
  }

  const fuelTypeLabel = (car: CarProfile): string => {
    const labels: Record<string, string> = {
      petrol: i18n['Petrol'],
      diesel: i18n['Diesel'],
      hybrid: i18n['Hybrid'],
      phev: i18n['PHEV'],
      electric: i18n['Electric'],
    }
    return labels[car.fuelType] ?? car.fuelType
  }

  const chipVariantKey = (fuelType: string): keyof typeof s.chipVariant =>
    fuelType in s.chipVariant ? (fuelType as keyof typeof s.chipVariant) : 'petrol'

  const formatPrice = (price: number, currency: string): string => {
    return formatCost(price, currency as AppState['settings']['currency'])
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
          <Show when={activeCar()}>
            {(car) => {
              const eff = () => formatEfficiency(car())
              return (
                <div class={s.vehicleSection}>
                  <span class={s.vehicleLabel}>{i18n['Active Vessel']}</span>
                  <h2 class={s.vehicleName}>{car().nickname}</h2>

                  <div class={s.fuelChips}>
                    <span class={`${s.chip} ${s.chipVariant[chipVariantKey(car().fuelType)]}`}>
                      {fuelTypeLabel(car())}
                    </span>
                  </div>

                  <div class={s.vehicleStats}>
                    <div class={`${s.statCard} ${s.statCardPrimary}`}>
                      <span class={s.statLabel}>{i18n['Avg Consumption']}</span>
                      <Show when={eff()} fallback={<span class={s.statValue}>{i18n['N/A']}</span>}>
                        {(e) => (
                          <div>
                            <span class={s.statValue}>{e().value}</span>
                            <span class={s.statUnit}>{e().unit}</span>
                          </div>
                        )}
                      </Show>
                    </div>
                    <div class={`${s.statCard} ${s.statCardTertiary}`}>
                      <span class={s.statLabel}>{i18n['Engine']}</span>
                      <div>
                        <span class={s.statValue}>
                          {car().engineSizeL
                            ? substitute(i18n['{{size}}L'], {
                                size: String(car().engineSizeL),
                              })
                            : i18n['--']}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }}
          </Show>

          <div class={s.pricesSection}>
            <div class={s.pricesHeader}>
              <h3 class={s.pricesTitle}>{i18n['Local Fuel Rates']}</h3>
              <span class={s.pricesLocation}>
                <span class={`material-symbols-outlined ${s.iconSm}`}>location_on</span>
                {appState().fuelPrices.source}
              </span>
            </div>

            <div class={s.pricesList}>
              <div class={`${s.priceCard} ${s.priceCardPetrol}`}>
                <div class={s.priceCardLeft}>
                  <div class={`${s.priceIcon} ${s.priceIconVariant.petrol}`}>
                    <span class="material-symbols-outlined">local_gas_station</span>
                  </div>
                  <div class={s.priceInfo}>
                    <span class={s.priceName}>{i18n['Unleaded']}</span>
                    <span class={s.priceSubtext}>{i18n['per litre']}</span>
                  </div>
                </div>
                <span class={`${s.priceValue} ${s.priceValueVariant.petrol}`}>
                  {formatPrice(appState().fuelPrices.petrolPerLitre, appState().settings.currency)}
                </span>
              </div>

              <div class={`${s.priceCard} ${s.priceCardDiesel}`}>
                <div class={s.priceCardLeft}>
                  <div class={`${s.priceIcon} ${s.priceIconVariant.diesel}`}>
                    <span class="material-symbols-outlined">oil_barrel</span>
                  </div>
                  <div class={s.priceInfo}>
                    <span class={s.priceName}>{i18n['Diesel']}</span>
                    <span class={s.priceSubtext}>{i18n['per litre']}</span>
                  </div>
                </div>
                <span class={`${s.priceValue} ${s.priceValueVariant.diesel}`}>
                  {formatPrice(appState().fuelPrices.dieselPerLitre, appState().settings.currency)}
                </span>
              </div>

              <div class={`${s.priceCard} ${s.priceCardElectric}`}>
                <div class={s.priceCardLeft}>
                  <div class={`${s.priceIcon} ${s.priceIconVariant.electric}`}>
                    <span class="material-symbols-outlined">bolt</span>
                  </div>
                  <div class={s.priceInfo}>
                    <span class={s.priceName}>{i18n['Electric']}</span>
                    <span class={s.priceSubtext}>{i18n['per kWh']}</span>
                  </div>
                </div>
                <span class={`${s.priceValue} ${s.priceValueVariant.electric}`}>
                  {formatPrice(
                    appState().fuelPrices.electricityPerKwh,
                    appState().settings.currency,
                  )}
                </span>
              </div>
            </div>

            <span class={s.lastUpdated}>
              {substitute(i18n['Updated {{time}}'], {
                time: formatLastUpdated(appState().fuelPrices.lastUpdated),
              })}
            </span>
          </div>
        </div>
      )}
    </Show>
  )
}
