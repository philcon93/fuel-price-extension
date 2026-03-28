import { createSignal, onMount, For, Show, type Component } from 'solid-js'
import * as s from './Home.css'
import { getAppState, setActiveCarId } from '../../utils/storage'
import { AVERAGE_CAR_ID, MAX_FREE_CARS, type AppState, type CarProfile } from '../../utils/types'
import { formatCost } from '../../utils/calculator'

interface HomeProps {
  onAddCar: () => void
  onEditCar: (id: string) => void
  onSettings: () => void
}

const Home: Component<HomeProps> = (props) => {
  const [state, setState] = createSignal<AppState | null>(null)

  onMount(async () => {
    const appState = await getAppState()
    setState(appState)
  })

  const activeCar = (): CarProfile | undefined =>
    state()?.cars.find(c => c.id === state()?.activeCarId)

  const carSummaryText = (car: CarProfile): string => {
    if (car.isDefault) return 'Fleet average for your region'
    const parts: string[] = []
    if (car.make && car.model) parts.push(`${car.make} ${car.model}`)
    if (car.year) parts.push(`${car.year}`)
    if (car.fuelType) parts.push(car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1))
    const eff = car.useRealWorld ? car.realWorldL100km : car.officialL100km
    if (eff) parts.push(`${eff} L/100km`)
    return parts.join(' · ')
  }

  const handleCarChange = async (e: Event) => {
    const select = e.target as HTMLSelectElement
    await setActiveCarId(select.value)
    const appState = await getAppState()
    setState(appState)
  }

  const handleAddCar = () => {
    const s = state()
    if (!s) return
    const customCars = s.cars.filter(c => !c.isDefault).length
    if (customCars >= MAX_FREE_CARS) {
      alert('Upgrade to Pro for unlimited car profiles')
      return
    }
    props.onAddCar()
  }

  const formatPrice = (price: number, currency: string): string => {
    return formatCost(price, currency as AppState['settings']['currency'])
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
            <span class={s.sectionLabel}>Active car</span>
            <select class={s.carSelect} value={appState().activeCarId} onChange={handleCarChange}>
              <For each={appState().cars}>
                {(car) => <option value={car.id}>{car.nickname}</option>}
              </For>
            </select>
            <Show when={activeCar()}>
              {(car) => (
                <div class={s.carSummary}>
                  {carSummaryText(car())}
                  <Show when={!car().isLocked}>
                    {' · '}
                    <button
                      class={s.addCarLink}
                      onClick={() => props.onEditCar(car().id)}
                      style={{ display: 'inline', "font-size": 'inherit' }}
                    >
                      Edit
                    </button>
                  </Show>
                </div>
              )}
            </Show>
          </div>

          <button class={s.addCarLink} onClick={handleAddCar}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            Add a car
          </button>

          <div class={s.section}>
            <span class={s.sectionLabel}>Fuel prices</span>
            <div class={s.pricesGrid}>
              <div class={s.priceCard}>
                <span class={s.priceLabel}>Petrol</span>
                <span class={s.priceValue}>
                  {formatPrice(appState().fuelPrices.petrolPerLitre, appState().settings.currency)}
                </span>
              </div>
              <div class={s.priceCard}>
                <span class={s.priceLabel}>Diesel</span>
                <span class={s.priceValue}>
                  {formatPrice(appState().fuelPrices.dieselPerLitre, appState().settings.currency)}
                </span>
              </div>
              <div class={s.priceCard}>
                <span class={s.priceLabel}>Electric</span>
                <span class={s.priceValue}>
                  {formatPrice(appState().fuelPrices.electricityPerKwh, appState().settings.currency)}/kWh
                </span>
              </div>
            </div>
            <span class={s.lastUpdated}>
              {appState().fuelPrices.source} · Updated {formatLastUpdated(appState().fuelPrices.lastUpdated)}
            </span>
          </div>
        </div>
      )}
    </Show>
  )
}

export default Home
