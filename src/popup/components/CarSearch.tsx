import { createSignal, Show, For, type Component } from 'solid-js'
import * as s from './CarSearch.css'
import { searchCars, type CarResult } from '../../utils/carLookup'
import { addCar, getAppState, updateCar, removeCar } from '../../utils/storage'
import ManualEntry from './ManualEntry'
import TrimPicker from './TrimPicker'
import type { CarProfile, CarQueryTrim } from '../../utils/types'

interface CarSearchProps {
  editCarId?: string
  onDone: () => void
}

const CarSearch: Component<CarSearchProps> = (props) => {
  const [query, setQuery] = createSignal('')
  const [results, setResults] = createSignal<CarResult[]>([])
  const [loading, setLoading] = createSignal(false)
  const [showManual, setShowManual] = createSignal(!!props.editCarId)
  const [selectedResult, setSelectedResult] = createSignal<CarResult | null>(null)
  const [editCar, setEditCar] = createSignal<CarProfile | null>(null)

  if (props.editCarId) {
    getAppState().then(state => {
      const car = state.cars.find(c => c.id === props.editCarId)
      if (car) setEditCar(car)
    })
  }

  let debounceTimer: ReturnType<typeof setTimeout>

  const handleSearch = (value: string) => {
    setQuery(value)
    setSelectedResult(null)
    clearTimeout(debounceTimer)
    if (value.trim().length < 2) {
      setResults([])
      return
    }
    debounceTimer = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await searchCars(value)
        setResults(r)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleSelectResult = (result: CarResult) => {
    setSelectedResult(result)
  }

  const handleTrimSelected = async (trim: CarQueryTrim) => {
    const profile: Omit<CarProfile, 'id'> = {
      nickname: `${trim.makeDisplay} ${trim.modelName} ${trim.modelYear}`,
      isDefault: false,
      isLocked: false,
      make: trim.makeDisplay,
      model: trim.modelName,
      year: trim.modelYear,
      trim: trim.modelTrim,
      fuelType: mapFuelType(trim.modelEngineFuel),
      engineSizeL: trim.modelEngineCC ? trim.modelEngineCC / 1000 : undefined,
      officialL100km: trim.modelLkm_mixed ?? trim.modelLkm_hwy,
      realWorldL100km: trim.modelLkm_mixed ? Math.round(trim.modelLkm_mixed * 1.15 * 10) / 10 : undefined,
      useRealWorld: true,
      isManual: false,
    }
    await addCar(profile)
    props.onDone()
  }

  const handleDelete = async () => {
    if (props.editCarId && confirm('Delete this car profile?')) {
      await removeCar(props.editCarId)
      props.onDone()
    }
  }

  return (
    <div class={s.container}>
      <Show when={!props.editCarId}>
        <Show when={!selectedResult()}>
          <input
            class={s.searchInput}
            type="text"
            placeholder='Search e.g. "Corolla 2023 hybrid"'
            value={query()}
            onInput={(e) => handleSearch(e.currentTarget.value)}
            autofocus
          />

          <Show when={loading()}>
            <span class={s.statusText}>Searching...</span>
          </Show>

          <Show when={!loading() && results().length > 0}>
            <div class={s.resultsList}>
              <For each={results()}>
                {(result) => (
                  <button class={s.resultItem} onClick={() => handleSelectResult(result)}>
                    <div class={s.resultTitle}>{result.makeDisplay} {result.modelName}</div>
                    <div class={s.resultMeta}>
                      {result.modelYear} · {result.trimCount} trim{result.trimCount !== 1 ? 's' : ''}
                    </div>
                  </button>
                )}
              </For>
            </div>
          </Show>

          <Show when={!loading() && query().length >= 2 && results().length === 0}>
            <span class={s.statusText}>No results found</span>
          </Show>

          <button class={s.toggleLink} onClick={() => setShowManual(!showManual())}>
            {showManual() ? 'Search instead' : 'Enter manually'}
          </button>
        </Show>

        <Show when={selectedResult()}>
          {(result) => (
            <TrimPicker
              make={result().makeDisplay}
              model={result().modelName}
              year={result().modelYear}
              onSelect={handleTrimSelected}
              onBack={() => setSelectedResult(null)}
            />
          )}
        </Show>
      </Show>

      <Show when={showManual() || props.editCarId}>
        <ManualEntry
          existingCar={editCar() ?? undefined}
          onSave={props.onDone}
        />
        <Show when={props.editCarId}>
          <button class={s.deleteButton} onClick={handleDelete}>
            Delete this car
          </button>
        </Show>
      </Show>
    </div>
  )
}

function mapFuelType(fuel: string): CarProfile['fuelType'] {
  const f = fuel.toLowerCase()
  if (f.includes('diesel')) return 'diesel'
  if (f.includes('electric')) return 'electric'
  if (f.includes('hybrid') || f.includes('phev')) return 'hybrid'
  return 'petrol'
}

export default CarSearch
