import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseQuery, searchCars, getTrims } from './carLookup'
import { getChromeMock } from '../../test-setup'

beforeEach(() => {
  vi.clearAllMocks()
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

  it('sends message to background and groups results', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockResolvedValueOnce({
      Models: [
        {
          model_name: 'Corolla',
          model_make_display: 'Toyota',
          model_year: '2023',
          model_trim: 'LE',
        },
        {
          model_name: 'Corolla',
          model_make_display: 'Toyota',
          model_year: '2023',
          model_trim: 'SE',
        },
        {
          model_name: 'Camry',
          model_make_display: 'Toyota',
          model_year: '2023',
          model_trim: 'XLE',
        },
      ],
    })

    const results = await searchCars('toyota')

    expect(mock.runtime.sendMessage).toHaveBeenCalledWith({
      type: 'CAR_QUERY_FETCH',
      url: expect.stringContaining('cmd=getModels&make=toyota'),
    })

    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({
      makeDisplay: 'Toyota',
      modelName: 'Corolla',
      modelYear: 2023,
      trimCount: 2,
    })
  })

  it('returns empty when API returns no Models', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockResolvedValueOnce({})

    const results = await searchCars('toyota')
    expect(results).toEqual([])
  })

  it('filters by model name', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockResolvedValueOnce({
      Models: [
        {
          model_name: 'Corolla',
          model_make_display: 'Toyota',
          model_year: '2023',
          model_trim: 'LE',
        },
        {
          model_name: 'Camry',
          model_make_display: 'Toyota',
          model_year: '2023',
          model_trim: 'SE',
        },
      ],
    })

    const results = await searchCars('toyota corolla')
    expect(results).toHaveLength(1)
    expect(results[0].modelName).toBe('Corolla')
  })

  it('throws when sendMessage returns null', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockResolvedValueOnce(null)

    await expect(searchCars('toyota')).rejects.toThrow('Car query fetch failed')
  })
})

describe('getTrims', () => {
  it('sends message and maps trim data', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockResolvedValueOnce({
      Trims: [
        {
          model_id: '123',
          model_make_display: 'Toyota',
          model_name: 'Corolla',
          model_year: '2023',
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
    })

    const trims = await getTrims('Toyota', 'Corolla', 2023)

    expect(mock.runtime.sendMessage).toHaveBeenCalledWith({
      type: 'CAR_QUERY_FETCH',
      url: expect.stringContaining('cmd=getTrims&make=Toyota&model=Corolla&year=2023'),
    })

    expect(trims).toHaveLength(1)
    expect(trims[0]).toEqual({
      modelId: '123',
      makeDisplay: 'Toyota',
      modelName: 'Corolla',
      modelYear: 2023,
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

  it('returns empty array when no trims found', async () => {
    const mock = getChromeMock()
    mock.runtime.sendMessage.mockResolvedValueOnce({})

    const trims = await getTrims('Toyota', 'Corolla', 2023)
    expect(trims).toEqual([])
  })
})
