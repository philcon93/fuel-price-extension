import { createSignal, type Component } from 'solid-js'
import { useQueryClient } from '@tanstack/solid-query'
import * as s from './ManualEntry.css'
import { addCar, updateCar } from '@utils/storage'
import type { CarProfile, FuelType } from '@utils/types'
import { AnalyticsEvents } from '@utils/analytics'

interface ManualEntryProps {
  existingCar?: CarProfile
  onSave: () => void
}

export const ManualEntry: Component<ManualEntryProps> = (props) => {
  const queryClient = useQueryClient()
  const car = () => props.existingCar
  const [nickname, setNickname] = createSignal(car()?.nickname ?? '')
  const [fuelType, setFuelType] = createSignal<FuelType>(car()?.fuelType ?? 'petrol')
  const [engineSize, setEngineSize] = createSignal(car()?.engineSizeL?.toString() ?? '')
  const [efficiency, setEfficiency] = createSignal(
    (car()?.realWorldL100km ?? car()?.officialL100km ?? '').toString(),
  )
  const [kwhEfficiency, setKwhEfficiency] = createSignal((car()?.kWh100km ?? '').toString())

  const isValid = () => {
    if (!nickname().trim()) return false
    if (fuelType() === 'electric') {
      return !!kwhEfficiency() && !isNaN(parseFloat(kwhEfficiency()))
    }
    return !!efficiency() && !isNaN(parseFloat(efficiency()))
  }

  const handleSave = async () => {
    if (!isValid()) return

    const profile: Omit<CarProfile, 'id'> = {
      nickname: nickname().trim(),
      isDefault: false,
      isLocked: false,
      fuelType: fuelType(),
      engineSizeL: engineSize() ? parseFloat(engineSize()) : undefined,
      realWorldL100km: fuelType() !== 'electric' ? parseFloat(efficiency()) : undefined,
      officialL100km: undefined,
      useRealWorld: true,
      kWh100km:
        fuelType() === 'electric' || fuelType() === 'phev'
          ? parseFloat(kwhEfficiency())
          : undefined,
      isManual: true,
    }

    const existingCar = car()
    if (existingCar) {
      await updateCar(existingCar.id, profile)
    } else {
      await addCar(profile)
      AnalyticsEvents.carAdded('manual', profile.fuelType)
    }
    await queryClient.invalidateQueries({ queryKey: ['appState'] })
    props.onSave()
  }

  return (
    <div class={s.form}>
      <div class={s.field}>
        <label class={s.fieldLabel} for="manual-nickname">
          Nickname
        </label>
        <input
          id="manual-nickname"
          class={s.input}
          type="text"
          placeholder='e.g. "My Corolla"'
          value={nickname()}
          onInput={(e) => setNickname(e.currentTarget.value)}
        />
      </div>

      <div class={s.field}>
        <label class={s.fieldLabel} for="manual-fuel-type">
          Fuel type
        </label>
        <select
          id="manual-fuel-type"
          class={s.select}
          value={fuelType()}
          onChange={(e) => setFuelType(e.currentTarget.value as FuelType)}
        >
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="phev">PHEV</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      <div class={s.field}>
        <label class={s.fieldLabel} for="manual-engine-size">
          Engine size
        </label>
        <select
          id="manual-engine-size"
          class={s.select}
          value={engineSize()}
          onChange={(e) => setEngineSize(e.currentTarget.value)}
        >
          <option value="">Select</option>
          <option value="1.0">1.0L</option>
          <option value="1.2">1.2L</option>
          <option value="1.5">1.5L</option>
          <option value="1.8">1.8L</option>
          <option value="2.0">2.0L</option>
          <option value="2.5">2.5L</option>
          <option value="3.0">3.0L</option>
          <option value="3.5">3.5L+</option>
        </select>
      </div>

      {fuelType() !== 'electric' && (
        <div class={s.field}>
          <label class={s.fieldLabel} for="manual-efficiency">
            Fuel efficiency (L/100km)
          </label>
          <input
            id="manual-efficiency"
            class={s.input}
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 7.5"
            value={efficiency()}
            onInput={(e) => setEfficiency(e.currentTarget.value)}
          />
        </div>
      )}

      {(fuelType() === 'electric' || fuelType() === 'phev') && (
        <div class={s.field}>
          <label class={s.fieldLabel} for="manual-kwh-efficiency">
            Electricity consumption (kWh/100km)
          </label>
          <input
            id="manual-kwh-efficiency"
            class={s.input}
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 15.0"
            value={kwhEfficiency()}
            onInput={(e) => setKwhEfficiency(e.currentTarget.value)}
          />
        </div>
      )}

      <button class={s.saveButton} onClick={handleSave} disabled={!isValid()}>
        <span class={`material-symbols-outlined ${s.iconMd}`}>check_circle</span>
        {car() ? 'Save Changes' : 'Save Car'}
      </button>
    </div>
  )
}
