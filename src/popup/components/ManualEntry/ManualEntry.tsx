import { createSignal, type Component } from 'solid-js'
import * as s from './ManualEntry.css'
import { addCar, updateCar } from '../../../utils/storage/storage'
import type { CarProfile, FuelType } from '../../../utils/types/types'

interface ManualEntryProps {
  existingCar?: CarProfile
  onSave: () => void
}

const ManualEntry: Component<ManualEntryProps> = (props) => {
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
    }
    props.onSave()
  }

  return (
    <div class={s.form}>
      <div class={s.field}>
        <label class={s.fieldLabel}>Nickname</label>
        <input
          class={s.input}
          type="text"
          placeholder='e.g. "My Corolla"'
          value={nickname()}
          onInput={(e) => setNickname(e.currentTarget.value)}
        />
      </div>

      <div class={s.field}>
        <label class={s.fieldLabel}>Fuel type</label>
        <select
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
        <label class={s.fieldLabel}>Engine size</label>
        <select
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
          <label class={s.fieldLabel}>Fuel efficiency (L/100km)</label>
          <input
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
          <label class={s.fieldLabel}>Electricity consumption (kWh/100km)</label>
          <input
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
        {car() ? 'Save changes' : 'Save car'}
      </button>
    </div>
  )
}

export default ManualEntry
