import { createSignal, onMount, For, Show, type Component } from 'solid-js'
import * as s from './TrimPicker.css'
import { getTrims } from '@utils/carLookup'
import type { CarQueryTrim } from '@utils/types'

interface TrimPickerProps {
  make: string
  model: string
  year: number
  onSelect: (trim: CarQueryTrim) => void
  onBack: () => void
}

export const TrimPicker: Component<TrimPickerProps> = (props) => {
  const [trims, setTrims] = createSignal<CarQueryTrim[]>([])
  const [loading, setLoading] = createSignal(true)

  onMount(async () => {
    try {
      const t = await getTrims(props.make, props.model, props.year)
      setTrims(t)
    } catch {
      setTrims([])
    } finally {
      setLoading(false)
    }
  })

  const formatEngine = (trim: CarQueryTrim): string => {
    const parts: string[] = []
    if (trim.modelEngineCC) parts.push(`${(trim.modelEngineCC / 1000).toFixed(1)}L`)
    if (trim.modelEngineFuel) parts.push(trim.modelEngineFuel)
    if (trim.modelLkm_mixed) parts.push(`${trim.modelLkm_mixed} L/100km`)
    if (trim.modelTransmissionType) parts.push(trim.modelTransmissionType)
    return parts.join(' · ')
  }

  return (
    <div class={s.container}>
      <button class={s.backLink} onClick={() => props.onBack()}>
        &larr; Back to search
      </button>
      <div class={s.heading}>
        {props.make} {props.model} {props.year}
      </div>
      <div class={s.subheading}>Select your trim variant:</div>

      <Show when={loading()}>
        <span class={s.loading}>Loading trims...</span>
      </Show>

      <Show when={!loading() && trims().length > 0}>
        <div class={s.trimList}>
          <For each={trims()}>
            {(trim) => (
              <button class={s.trimItem} onClick={() => props.onSelect(trim)}>
                <div class={s.trimName}>{trim.modelTrim || 'Base'}</div>
                <div class={s.trimMeta}>{formatEngine(trim)}</div>
              </button>
            )}
          </For>
        </div>
      </Show>

      <Show when={!loading() && trims().length === 0}>
        <span class={s.loading}>No trims found</span>
      </Show>
    </div>
  )
}
