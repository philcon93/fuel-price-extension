import { For, Show, type Component } from 'solid-js'
import { createQuery } from '@tanstack/solid-query'
import * as s from './TrimPicker.css'
import { getTrims } from '@utils/carLookup'
import type { CarQueryTrim } from '@utils/types'
import { useI18n } from '@utils/i18n'

interface TrimPickerProps {
  make: string
  model: string
  year?: number
  onSelect: (trim: CarQueryTrim) => void
  onBack: () => void
}

export const TrimPicker: Component<TrimPickerProps> = (props) => {
  const i18n = useI18n()

  const trimsQuery = createQuery(() => ({
    queryKey: ['carTrims', props.make, props.model, props.year] as const,
    queryFn: () => getTrims(props.make, props.model, props.year),
    staleTime: 5 * 60_000,
  }))

  const trims = () => trimsQuery.data ?? []

  const formatEngine = (trim: CarQueryTrim): string => {
    const parts: string[] = []
    if (trim.modelEngineCC) parts.push(`${(trim.modelEngineCC / 1000).toFixed(1)}L`)
    if (trim.modelEngineFuel) parts.push(trim.modelEngineFuel)
    if (trim.modelLkm_mixed) parts.push(`${trim.modelLkm_mixed} ${i18n['L/100km']}`)
    if (trim.modelTransmissionType) parts.push(trim.modelTransmissionType)
    return parts.join(' · ')
  }

  return (
    <div class={s.container}>
      <button class={s.backLink} onClick={() => props.onBack()}>
        {i18n['← Back to search']}
      </button>
      <div class={s.heading}>
        {props.make} {props.model} {props.year}
      </div>
      <div class={s.subheading}>{i18n['Select your trim variant:']}</div>

      <Show when={trimsQuery.isLoading}>
        <span class={s.loading}>{i18n['Loading trims...']}</span>
      </Show>

      <Show when={!trimsQuery.isLoading && trims().length > 0}>
        <div class={s.trimList}>
          <For each={trims()}>
            {(trim) => (
              <button class={s.trimItem} onClick={() => props.onSelect(trim)}>
                <div class={s.trimName}>
                  {trim.modelTrim || i18n['Base']}
                  <Show when={trim.modelYear}>
                    <span class={s.trimYear}> ({trim.modelYear})</span>
                  </Show>
                </div>
                <div class={s.trimMeta}>{formatEngine(trim)}</div>
              </button>
            )}
          </For>
        </div>
      </Show>

      <Show when={!trimsQuery.isLoading && trims().length === 0}>
        <span class={s.loading}>{i18n['No trims found']}</span>
      </Show>
    </div>
  )
}
