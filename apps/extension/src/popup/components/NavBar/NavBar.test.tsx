import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import { NavBar } from './NavBar'

describe('NavBar', () => {
  it('renders all four tabs', () => {
    render(() => <NavBar activeView="home" onNavigate={() => {}} />)

    expect(screen.getByLabelText('Dashboard')).toBeInTheDocument()
    expect(screen.getByLabelText('Cars')).toBeInTheDocument()
    expect(screen.getByLabelText('History')).toBeInTheDocument()
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('calls onNavigate with correct kind when tab is clicked', () => {
    const onNavigate = vi.fn()
    render(() => <NavBar activeView="home" onNavigate={onNavigate} />)

    fireEvent.click(screen.getByLabelText('Cars'))
    expect(onNavigate).toHaveBeenCalledWith('cars')

    fireEvent.click(screen.getByLabelText('Settings'))
    expect(onNavigate).toHaveBeenCalledWith('settings')
  })

  it('highlights the active tab', () => {
    render(() => <NavBar activeView="cars" onNavigate={() => {}} />)

    const carsButton = screen.getByLabelText('Cars')
    expect(carsButton.className).toContain('tabActive')
  })

  it('maps addCar and editCar to cars tab as active', () => {
    render(() => <NavBar activeView="addCar" onNavigate={() => {}} />)

    const carsButton = screen.getByLabelText('Cars')
    expect(carsButton.className).toContain('tabActive')
  })
})
