import { createSignal, createEffect, Show, For, type Component } from 'solid-js'
import { createQuery, useQueryClient } from '@tanstack/solid-query'
import * as s from './CarSearch.css'
import { searchCars, type CarResult } from '@utils/carLookup'
import { addCar, getAppState, removeCar } from '@utils/storage'
import { ManualEntry } from '@components/ManualEntry'
import { TrimPicker } from '@components/TrimPicker'
import type { CarProfile, CarQueryTrim } from '@utils/types'
import { AnalyticsEvents } from '@utils/analytics'

interface CarSearchProps {
  editCarId?: string
  onDone: () => void
}

export const CarSearch: Component<CarSearchProps> = (props) => {
  const queryClient = useQueryClient()
  const [query, setQuery] = createSignal('')
  const [debouncedQuery, setDebouncedQuery] = createSignal('')
  const [showManual, setShowManual] = createSignal(false)
  const [selectedResult, setSelectedResult] = createSignal<CarResult | null>(null)
  const [editCar, setEditCar] = createSignal<CarProfile | null>(null)

  createEffect(() => {
    const id = props.editCarId
    if (id) {
      setShowManual(true)
      getAppState().then((state) => {
        const car = state.cars.find((c) => c.id === id)
        if (car) setEditCar(car)
      })
    }
  })

  let debounceTimer: ReturnType<typeof setTimeout>

  const handleSearch = (value: string) => {
    setQuery(value)
    setSelectedResult(null)
    clearTimeout(debounceTimer)
    if (value.trim().length < 2) {
      setDebouncedQuery('')
      return
    }
    debounceTimer = setTimeout(() => {
      setDebouncedQuery(value)
    }, 400)
  }

  const searchQuery = createQuery(() => ({
    queryKey: ['carSearch', debouncedQuery()] as const,
    queryFn: async () => {
      const q = debouncedQuery()
      if (!q || q.trim().length < 2) return []
      const results = await searchCars(q)
      AnalyticsEvents.carSearchPerformed(q.length, results.length)
      return results
    },
    enabled: debouncedQuery().trim().length >= 2,
    staleTime: 60_000,
  }))

  const results = () => searchQuery.data ?? []
  const loading = () => searchQuery.isLoading && debouncedQuery().trim().length >= 2

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
      realWorldL100km: trim.modelLkm_mixed
        ? Math.round(trim.modelLkm_mixed * 1.15 * 10) / 10
        : undefined,
      useRealWorld: true,
      isManual: false,
    }
    await addCar(profile)
    await queryClient.invalidateQueries({ queryKey: ['appState'] })
    AnalyticsEvents.trimSelected(profile.fuelType)
    AnalyticsEvents.carAdded('lookup', profile.fuelType)
    props.onDone()
  }

  const handleDelete = async () => {
    if (props.editCarId && confirm('Delete this car profile?')) {
      await removeCar(props.editCarId)
      await queryClient.invalidateQueries({ queryKey: ['appState'] })
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
            placeholder='Search e.g. "Toyota Corolla 2020"'
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
                    <div class={s.resultTitle}>
                      {result.makeDisplay} {result.modelName}
                    </div>
                    <Show when={result.modelYear}>
                      <div class={s.resultMeta}>{result.modelYear}</div>
                    </Show>
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

      <Show when={props.editCarId ? editCar() : showManual()}>
        <ManualEntry existingCar={editCar() ?? undefined} onSave={props.onDone} />
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
