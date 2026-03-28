import { For, Show, type Component } from 'solid-js'
import { createQuery, useQueryClient } from '@tanstack/solid-query'
import * as s from './Cars.css'
import { getAppState, setActiveCarId } from '@utils/storage'
import { MAX_FREE_CARS, type CarProfile } from '@utils/types'
import { useI18n, substitute } from '@utils/i18n'

interface CarsProps {
  onAddCar: () => void
  onEditCar: (id: string) => void
}

export const Cars: Component<CarsProps> = (props) => {
  const i18n = useI18n()
  const queryClient = useQueryClient()

  const stateQuery = createQuery(() => ({
    queryKey: ['appState'] as const,
    queryFn: getAppState,
  }))

  const state = () => stateQuery.data ?? null

  const activeCar = (): CarProfile | undefined =>
    state()?.cars.find((c) => c.id === state()?.activeCarId)

  const otherCars = (): CarProfile[] =>
    state()?.cars.filter((c) => c.id !== state()?.activeCarId) ?? []

  const formatEfficiency = (car: CarProfile): string | null => {
    if (car.fuelType === 'electric') {
      return car.kWh100km
        ? substitute(i18n['{{value}} kWh/100km'], { value: String(car.kWh100km) })
        : null
    }
    const l100km = car.useRealWorld ? car.realWorldL100km : car.officialL100km
    return l100km
      ? substitute(i18n['{{value}} L/100km'], { value: String(l100km) })
      : null
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

  const fuelIcon = (fuelType: string): string => {
    switch (fuelType) {
      case 'electric':
        return 'electric_car'
      case 'diesel':
        return 'oil_barrel'
      default:
        return 'local_gas_station'
    }
  }

  const fuelVariantKey = (fuelType: string): keyof typeof s.fuelChipVariant =>
    fuelType in s.fuelChipVariant ? (fuelType as keyof typeof s.fuelChipVariant) : 'petrol'

  const handleSetActive = async (carId: string) => {
    await setActiveCarId(carId)
    await queryClient.invalidateQueries({ queryKey: ['appState'] })
  }

  const handleAddCar = () => {
    const st = state()
    if (!st) return
    const customCars = st.cars.filter((c) => !c.isDefault).length
    if (customCars >= MAX_FREE_CARS) {
      alert(i18n['Upgrade to Pro for unlimited car profiles'])
      return
    }
    props.onAddCar()
  }

  return (
    <Show when={state()} fallback={<div class={s.container}>{i18n['Loading...']}</div>}>
      {(appState) => (
        <div class={s.container}>
          <div>
            <div class={s.pageTitle}>{i18n['Your Garage']}</div>
            <div class={s.pageSubtitle}>{i18n['Manage your fleet']}</div>
          </div>

          <Show when={activeCar()}>
            {(car) => {
              const variant = () => fuelVariantKey(car().fuelType)
              return (
                <div class={s.activeCardWrapper}>
                  <div class={s.activeCardGlow} />
                  <div class={s.activeCard}>
                    <div class={s.activeCardHeader}>
                      <div class={s.activeCardInfo}>
                        <span class={s.activeLabel}>{i18n['Current Active']}</span>
                        <span class={s.activeCarName}>{car().nickname}</span>
                      </div>
                      <span class={`${s.fuelChip} ${s.fuelChipVariant[variant()]}`}>
                        {fuelTypeLabel(car())}
                      </span>
                    </div>

                    <div class={s.statsGrid}>
                      <div class={s.statBox}>
                        <div class={s.statBoxLabel}>{i18n['Efficiency']}</div>
                        <div class={s.statBoxValue}>{formatEfficiency(car()) ?? i18n['N/A']}</div>
                      </div>
                      <div class={s.statBox}>
                        <div class={s.statBoxLabel}>{i18n['Fuel Type']}</div>
                        <div class={s.statBoxValue}>{fuelTypeLabel(car())}</div>
                      </div>
                    </div>

                    <Show when={!car().isLocked}>
                      <button class={s.editButton} onClick={() => props.onEditCar(car().id)}>
                        <span class={`material-symbols-outlined ${s.iconSm}`}>edit</span>
                        {i18n['Edit Configuration']}
                      </button>
                    </Show>
                  </div>
                </div>
              )
            }}
          </Show>

          <Show when={otherCars().length > 0}>
            <div>
              <div class={s.sectionHeader}>
                <span class={s.sectionLabel}>{i18n['Stored Vehicles']}</span>
                <span class={s.carCount}>
                  {substitute(i18n['{{count}} More'], {
                    count: otherCars().length.toString(),
                  })}
                </span>
              </div>

              <div class={s.carList}>
                <For each={otherCars()}>
                  {(car) => {
                    const variant = fuelVariantKey(car.fuelType)
                    return (
                      <div class={`${s.carItem} ${s.carItemBorderVariant[variant]}`}>
                        <div class={s.carItemLeft}>
                          <div class={`${s.carIcon} ${s.carIconColorVariant[variant]}`}>
                            <span class="material-symbols-outlined">{fuelIcon(car.fuelType)}</span>
                          </div>
                          <div class={s.carItemInfo}>
                            <span class={s.carItemName}>{car.nickname}</span>
                            <span class={s.carItemMeta}>
                              {fuelTypeLabel(car)}
                              {formatEfficiency(car) ? ` · ${formatEfficiency(car)}` : ''}
                            </span>
                          </div>
                        </div>
                        <div class={s.carItemActions}>
                          <button
                            class={s.carItemAction}
                            onClick={() => handleSetActive(car.id)}
                            aria-label={i18n['Set as active']}
                            title={i18n['Set as active']}
                          >
                            <span class="material-symbols-outlined">check_circle</span>
                          </button>
                          <Show when={!car.isLocked}>
                            <button
                              class={s.carItemAction}
                              onClick={() => props.onEditCar(car.id)}
                              aria-label={i18n['Edit car']}
                            >
                              <span class="material-symbols-outlined">settings</span>
                            </button>
                          </Show>
                        </div>
                      </div>
                    )
                  }}
                </For>
              </div>
            </div>
          </Show>

          <button class={s.addCarCard} onClick={handleAddCar}>
            <div class={s.addCarIcon}>
              <span class="material-symbols-outlined">add</span>
            </div>
            <span class={s.addCarLabel}>{i18n['Register New Vehicle']}</span>
          </button>
        </div>
      )}
    </Show>
  )
}
