import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { ManualEntry } from './ManualEntry'
import type { CarProfile } from '@utils/types'

const mockAddCar = vi.fn()
const mockUpdateCar = vi.fn()

vi.mock('@utils/storage', () => ({
  addCar: (...args: unknown[]) => mockAddCar(...args),
  updateCar: (...args: unknown[]) => mockUpdateCar(...args),
}))

function createExistingCar(overrides?: Partial<CarProfile>): CarProfile {
  return {
    id: 'car-1',
    nickname: 'My Corolla',
    isDefault: false,
    isLocked: false,
    fuelType: 'petrol',
    realWorldL100km: 7.5,
    officialL100km: 6.5,
    useRealWorld: true,
    isManual: true,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ManualEntry', () => {
  it('renders form fields for a new car', () => {
    render(() => <ManualEntry onSave={() => {}} />)

    expect(screen.getByLabelText('Nickname')).toBeInTheDocument()
    expect(screen.getByLabelText('Fuel type')).toBeInTheDocument()
    expect(screen.getByLabelText('Engine size')).toBeInTheDocument()
    expect(screen.getByLabelText('Fuel efficiency (L/100km)')).toBeInTheDocument()
  })

  it('shows "Save car" button for new cars', () => {
    render(() => <ManualEntry onSave={() => {}} />)
    expect(screen.getByText('Save car')).toBeInTheDocument()
  })

  it('shows "Save changes" button for existing cars', () => {
    render(() => <ManualEntry existingCar={createExistingCar()} onSave={() => {}} />)
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })

  it('populates form with existing car data', () => {
    render(() => <ManualEntry existingCar={createExistingCar()} onSave={() => {}} />)

    const nicknameInput = screen.getByLabelText('Nickname') as HTMLInputElement
    expect(nicknameInput.value).toBe('My Corolla')
  })

  it('disables save when nickname is empty', () => {
    render(() => <ManualEntry onSave={() => {}} />)
    const saveButton = screen.getByText('Save car') as HTMLButtonElement
    expect(saveButton.disabled).toBe(true)
  })

  it('disables save when efficiency is missing', () => {
    render(() => <ManualEntry onSave={() => {}} />)

    fireEvent.input(screen.getByLabelText('Nickname'), { target: { value: 'Test Car' } })

    const saveButton = screen.getByText('Save car') as HTMLButtonElement
    expect(saveButton.disabled).toBe(true)
  })

  it('enables save when nickname and efficiency are provided', () => {
    render(() => <ManualEntry onSave={() => {}} />)

    fireEvent.input(screen.getByLabelText('Nickname'), { target: { value: 'Test Car' } })
    fireEvent.input(screen.getByLabelText('Fuel efficiency (L/100km)'), {
      target: { value: '7.5' },
    })

    const saveButton = screen.getByText('Save car') as HTMLButtonElement
    expect(saveButton.disabled).toBe(false)
  })

  it('calls addCar for new cars on save', async () => {
    const onSave = vi.fn()
    mockAddCar.mockResolvedValue({ id: 'new-car' })

    render(() => <ManualEntry onSave={onSave} />)

    fireEvent.input(screen.getByLabelText('Nickname'), { target: { value: 'Test Car' } })
    fireEvent.input(screen.getByLabelText('Fuel efficiency (L/100km)'), {
      target: { value: '7.5' },
    })

    fireEvent.click(screen.getByText('Save car'))

    await waitFor(() => {
      expect(mockAddCar).toHaveBeenCalledWith(
        expect.objectContaining({
          nickname: 'Test Car',
          fuelType: 'petrol',
          realWorldL100km: 7.5,
          isManual: true,
        }),
      )
      expect(onSave).toHaveBeenCalledOnce()
    })
  })

  it('calls updateCar for existing cars on save', async () => {
    const onSave = vi.fn()
    mockUpdateCar.mockResolvedValue(undefined)

    render(() => <ManualEntry existingCar={createExistingCar()} onSave={onSave} />)

    fireEvent.input(screen.getByLabelText('Nickname'), { target: { value: 'Updated Name' } })

    fireEvent.click(screen.getByText('Save changes'))

    await waitFor(() => {
      expect(mockUpdateCar).toHaveBeenCalledWith(
        'car-1',
        expect.objectContaining({
          nickname: 'Updated Name',
          isManual: true,
        }),
      )
      expect(onSave).toHaveBeenCalledOnce()
    })
  })

  it('shows kWh field when fuel type is electric', () => {
    render(() => <ManualEntry onSave={() => {}} />)

    fireEvent.change(screen.getByLabelText('Fuel type'), { target: { value: 'electric' } })

    expect(screen.getByLabelText('Electricity consumption (kWh/100km)')).toBeInTheDocument()
    expect(screen.queryByLabelText('Fuel efficiency (L/100km)')).not.toBeInTheDocument()
  })

  it('shows both kWh and L/100km fields when fuel type is phev', () => {
    render(() => <ManualEntry onSave={() => {}} />)

    fireEvent.change(screen.getByLabelText('Fuel type'), { target: { value: 'phev' } })

    expect(screen.getByLabelText('Electricity consumption (kWh/100km)')).toBeInTheDocument()
    expect(screen.getByLabelText('Fuel efficiency (L/100km)')).toBeInTheDocument()
  })

  it('requires kWh efficiency for electric cars', () => {
    render(() => <ManualEntry onSave={() => {}} />)

    fireEvent.change(screen.getByLabelText('Fuel type'), { target: { value: 'electric' } })
    fireEvent.input(screen.getByLabelText('Nickname'), { target: { value: 'My EV' } })

    const saveButton = screen.getByText('Save car') as HTMLButtonElement
    expect(saveButton.disabled).toBe(true)

    fireEvent.input(screen.getByLabelText('Electricity consumption (kWh/100km)'), {
      target: { value: '15.0' },
    })

    expect(saveButton.disabled).toBe(false)
  })
})
