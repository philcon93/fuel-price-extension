import type { CarQueryTrim } from './types'

const API_BASE = 'https://www.carqueryapi.com/api/0.3/'

export interface CarResult {
  makeDisplay: string
  modelName: string
  modelYear: number
  trimCount: number
}

interface ParsedQuery {
  make?: string
  model?: string
  year?: number
  keywords: string[]
}

export function parseQuery(input: string): ParsedQuery {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return { keywords: [] }
  const tokens = trimmed.split(/\s+/)
  const result: ParsedQuery = { keywords: [] }

  for (const token of tokens) {
    const yearMatch = token.match(/^(19|20)\d{2}$/)
    if (yearMatch) {
      result.year = parseInt(token)
      continue
    }
    // Skip fuel-type keywords — used for filtering later, not for the API query
    if (['hybrid', 'diesel', 'petrol', 'electric', 'phev', 'ev'].includes(token)) {
      result.keywords.push(token)
      continue
    }
    if (!result.make) {
      result.make = token
    } else if (!result.model) {
      result.model = token
    } else {
      result.keywords.push(token)
    }
  }

  return result
}

async function fetchJsonp(url: string): Promise<unknown> {
  const callbackName = `carquery_cb_${Date.now()}`
  const fullUrl = `${url}&callback=${callbackName}`

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const w = window as unknown as Record<string, unknown>
    w[callbackName] = (data: unknown) => {
      resolve(data)
      script.remove()
      delete w[callbackName]
    }
    script.onerror = () => {
      reject(new Error('JSONP request failed'))
      script.remove()
      delete w[callbackName]
    }
    script.src = fullUrl
    document.head.appendChild(script)
  })
}

export async function searchCars(query: string): Promise<CarResult[]> {
  const parsed = parseQuery(query)
  if (!parsed.make) return []

  let url = `${API_BASE}?cmd=getModels&make=${encodeURIComponent(parsed.make)}`
  if (parsed.year) url += `&year=${parsed.year}`
  if (parsed.model) url += `&model=${encodeURIComponent(parsed.model)}`

  const data = (await fetchJsonp(url)) as {
    Models?: Array<{
      model_name: string
      model_make_display: string
      model_year: string
      model_trim: string
    }>
  }

  if (!data.Models) return []

  const grouped = new Map<string, CarResult>()

  for (const m of data.Models) {
    const key = `${m.model_make_display}|${m.model_name}|${m.model_year}`
    const existing = grouped.get(key)
    if (existing) {
      existing.trimCount++
    } else {
      grouped.set(key, {
        makeDisplay: m.model_make_display,
        modelName: m.model_name,
        modelYear: parseInt(m.model_year),
        trimCount: 1,
      })
    }
  }

  let results = Array.from(grouped.values())

  if (parsed.model) {
    const modelLower = parsed.model.toLowerCase()
    results = results.filter((r) => r.modelName.toLowerCase().includes(modelLower))
  }

  if (parsed.year) {
    results = results.filter((r) => r.modelYear === parsed.year)
  }

  return results.slice(0, 20)
}

export async function getTrims(make: string, model: string, year: number): Promise<CarQueryTrim[]> {
  const url = `${API_BASE}?cmd=getTrims&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}`
  const data = (await fetchJsonp(url)) as { Trims?: Array<Record<string, string>> }

  if (!data.Trims) return []

  return data.Trims.map((t) => ({
    modelId: t.model_id || '',
    makeDisplay: t.model_make_display || make,
    modelName: t.model_name || model,
    modelYear: parseInt(t.model_year) || year,
    modelTrim: t.model_trim || '',
    modelEngineCC: parseFloat(t.model_engine_cc) || 0,
    modelEngineFuel: t.model_engine_fuel || '',
    modelLkm_hwy: t.model_lkm_hwy ? parseFloat(t.model_lkm_hwy) : undefined,
    modelLkm_city: t.model_lkm_city ? parseFloat(t.model_lkm_city) : undefined,
    modelLkm_mixed: t.model_lkm_mixed ? parseFloat(t.model_lkm_mixed) : undefined,
    modelBody: t.model_body || '',
    modelDrive: t.model_drive || '',
    modelTransmissionType: t.model_transmission_type || '',
  }))
}
