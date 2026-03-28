import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseQuery, searchCars, getTrims } from './carLookup'

beforeEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('parseQuery', () => {
  it('parses make only', () => {
    const result = parseQuery('toyota')
    expect(result.make).toBe('toyota')
    expect(result.model).toBeUndefined()
    expect(result.year).toBeUndefined()
  })

  it('parses make and model', () => {
    const result = parseQuery('toyota corolla')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
  })

  it('parses make, model, and year', () => {
    const result = parseQuery('toyota corolla 2023')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
    expect(result.year).toBe(2023)
  })

  it('extracts fuel type keywords', () => {
    const result = parseQuery('toyota corolla 2023 hybrid')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
    expect(result.year).toBe(2023)
    expect(result.keywords).toContain('hybrid')
  })

  it('handles year before model', () => {
    const result = parseQuery('toyota 2023 corolla')
    expect(result.make).toBe('toyota')
    expect(result.model).toBe('corolla')
    expect(result.year).toBe(2023)
  })

  it('handles diesel keyword', () => {
    const result = parseQuery('ford ranger diesel')
    expect(result.keywords).toContain('diesel')
  })

  it('handles empty input', () => {
    const result = parseQuery('')
    expect(result.make).toBeUndefined()
    expect(result.model).toBeUndefined()
    expect(result.year).toBeUndefined()
    expect(result.keywords).toEqual([])
  })

  it('handles extra whitespace', () => {
    const result = parseQuery('  honda   civic  ')
    expect(result.make).toBe('honda')
    expect(result.model).toBe('civic')
  })
})

describe('searchCars', () => {
  it('returns empty array when no make is provided', async () => {
    const results = await searchCars('hybrid')
    expect(results).toEqual([])
  })

  it('fetches models and returns car results', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          Models: [
            { model_name: 'Corolla', model_make_id: 'Toyota' },
            { model_name: 'Camry', model_make_id: 'Toyota' },
          ],
        }),
      ),
    )

    const results = await searchCars('toyota')

    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('cmd=getModels&make=toyota'))

    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({
      makeDisplay: 'Toyota',
      modelName: 'Corolla',
      modelYear: undefined,
    })
    expect(results[1]).toEqual({
      makeDisplay: 'Toyota',
      modelName: 'Camry',
      modelYear: undefined,
    })
  })

  it('includes year in results when parsed from query', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          Models: [{ model_name: 'Corolla', model_make_id: 'Toyota' }],
        }),
      ),
    )

    const results = await searchCars('toyota corolla 2020')

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('year=2020'))
    expect(results).toHaveLength(1)
    expect(results[0].modelYear).toBe(2020)
  })

  it('returns empty when API returns no Models', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({})))

    const results = await searchCars('toyota')
    expect(results).toEqual([])
  })

  it('filters by model name', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          Models: [
            { model_name: 'Corolla', model_make_id: 'Toyota' },
            { model_name: 'Camry', model_make_id: 'Toyota' },
          ],
        }),
      ),
    )

    const results = await searchCars('toyota corolla')
    expect(results).toHaveLength(1)
    expect(results[0].modelName).toBe('Corolla')
  })

  it('throws when API returns non-OK status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('Forbidden', { status: 403 }))

    await expect(searchCars('toyota')).rejects.toThrow('CarQuery API returned 403')
  })
})

describe('getTrims', () => {
  it('fetches and maps trim data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          Trims: [
            {
              model_id: '123',
              model_make_display: 'Toyota',
              model_name: 'Corolla',
              model_year: '2020',
              model_trim: 'LE',
              model_engine_cc: '1800',
              model_engine_fuel: 'Gasoline',
              model_lkm_hwy: '6.5',
              model_lkm_city: '8.5',
              model_lkm_mixed: '7.5',
              model_body: 'Sedan',
              model_drive: 'Front',
              model_transmission_type: 'Automatic',
            },
          ],
        }),
      ),
    )

    const trims = await getTrims('Toyota', 'Corolla', 2020)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('cmd=getTrims&make=Toyota&model=Corolla&year=2020'),
    )

    expect(trims).toHaveLength(1)
    expect(trims[0]).toEqual({
      modelId: '123',
      makeDisplay: 'Toyota',
      modelName: 'Corolla',
      modelYear: 2020,
      modelTrim: 'LE',
      modelEngineCC: 1800,
      modelEngineFuel: 'Gasoline',
      modelLkm_hwy: 6.5,
      modelLkm_city: 8.5,
      modelLkm_mixed: 7.5,
      modelBody: 'Sedan',
      modelDrive: 'Front',
      modelTransmissionType: 'Automatic',
    })
  })

  it('fetches without year when not provided', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ Trims: [] })))

    await getTrims('Toyota', 'Corolla')

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.not.stringContaining('year='))
  })

  it('returns empty array when no trims found', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({})))

    const trims = await getTrims('Toyota', 'Corolla', 2020)
    expect(trims).toEqual([])
  })
})
