import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { TrimPicker } from './TrimPicker'
import { withQueryProvider } from '../../../test-setup'
import type { CarQueryTrim } from '@utils/types'

const mockGetTrims = vi.fn<() => Promise<CarQueryTrim[]>>()

vi.mock('@utils/carLookup', () => ({
  getTrims: (...args: unknown[]) => mockGetTrims(...(args as [])),
}))

function createMockTrim(overrides?: Partial<CarQueryTrim>): CarQueryTrim {
  return {
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
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TrimPicker', () => {
  it('shows loading state while fetching trims', () => {
    mockGetTrims.mockReturnValue(new Promise(() => {}))

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    expect(screen.getByText('Loading trims...')).toBeInTheDocument()
  })

  it('renders the heading with make, model, and year', () => {
    mockGetTrims.mockReturnValue(new Promise(() => {}))

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    expect(screen.getByText('Toyota Corolla 2020')).toBeInTheDocument()
  })

  it('renders trims after loading', async () => {
    mockGetTrims.mockResolvedValue([
      createMockTrim({ modelTrim: 'LE' }),
      createMockTrim({ modelTrim: 'SE', modelEngineCC: 2000 }),
    ])

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText(/^LE/)).toBeInTheDocument()
      expect(screen.getByText(/^SE/)).toBeInTheDocument()
    })
  })

  it('shows "Base" for trims without a name', async () => {
    mockGetTrims.mockResolvedValue([createMockTrim({ modelTrim: '' })])

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText(/^Base/)).toBeInTheDocument()
    })
  })

  it('shows "No trims found" when API returns empty', async () => {
    mockGetTrims.mockResolvedValue([])

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('No trims found')).toBeInTheDocument()
    })
  })

  it('calls onSelect when a trim is clicked', async () => {
    const onSelect = vi.fn()
    const trim = createMockTrim({ modelTrim: 'LE' })
    mockGetTrims.mockResolvedValue([trim])

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={onSelect}
          onBack={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText(/^LE/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/^LE/))
    expect(onSelect).toHaveBeenCalledWith(trim)
  })

  it('calls onBack when back link is clicked', () => {
    const onBack = vi.fn()
    mockGetTrims.mockReturnValue(new Promise(() => {}))

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={onBack}
        />
      )),
    )

    fireEvent.click(screen.getByText(/Back to search/))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('displays engine info in trim metadata', async () => {
    mockGetTrims.mockResolvedValue([
      createMockTrim({
        modelTrim: 'LE',
        modelEngineCC: 1800,
        modelEngineFuel: 'Gasoline',
        modelLkm_mixed: 7.5,
        modelTransmissionType: 'Automatic',
      }),
    ])

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('1.8L · Gasoline · 7.5 L/100km · Automatic')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    mockGetTrims.mockRejectedValue(new Error('Network error'))

    render(
      withQueryProvider(() => (
        <TrimPicker
          make="Toyota"
          model="Corolla"
          year={2020}
          onSelect={() => {}}
          onBack={() => {}}
        />
      )),
    )

    await waitFor(() => {
      expect(screen.getByText('No trims found')).toBeInTheDocument()
    })
  })
})
