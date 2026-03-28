import type { CarQueryTrim } from '@utils/types'

const API_BASE = 'https://www.carqueryapi.com/api/0.3/'

export interface CarResult {
  makeDisplay: string
  modelName: string
  modelYear?: number
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

async function fetchCarQuery(params: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}?${params}`)
  if (!res.ok) throw new Error(`CarQuery API returned ${res.status}`)
  return res.json()
}

export async function searchCars(query: string): Promise<CarResult[]> {
  const parsed = parseQuery(query)
  if (!parsed.make) return []

  let params = `cmd=getModels&make=${encodeURIComponent(parsed.make)}`
  if (parsed.year) params += `&year=${parsed.year}`

  const data = (await fetchCarQuery(params)) as {
    Models?: Array<{
      model_name: string
      model_make_id: string
    }>
  }

  if (!data.Models) return []

  let results: CarResult[] = data.Models.map((m) => ({
    makeDisplay: m.model_make_id,
    modelName: m.model_name,
    modelYear: parsed.year,
  }))

  if (parsed.model) {
    const modelLower = parsed.model.toLowerCase()
    results = results.filter((r) => r.modelName.toLowerCase().includes(modelLower))
  }

  return results.slice(0, 20)
}

export async function getTrims(
  make: string,
  model: string,
  year?: number,
): Promise<CarQueryTrim[]> {
  let params = `cmd=getTrims&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
  if (year) params += `&year=${year}`

  const data = (await fetchCarQuery(params)) as { Trims?: Array<Record<string, string>> }

  if (!data.Trims) return []

  return data.Trims.map((t) => ({
    modelId: t.model_id || '',
    makeDisplay: t.model_make_display || t.make_display || make,
    modelName: t.model_name || model,
    modelYear: parseInt(t.model_year) || 0,
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
