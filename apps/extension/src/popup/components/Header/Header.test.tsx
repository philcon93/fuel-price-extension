import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import { Header } from './Header'

describe('Header (deprecated - replaced by NavBar)', () => {
  it('renders the title', () => {
    render(() => (
      <Header
        title="Fuel Cost"
        showBack={false}
        onBack={() => {}}
        onSettings={() => {}}
        showSettings={false}
      />
    ))
    expect(screen.getByText('Fuel Cost')).toBeInTheDocument()
  })

  it('shows back button when showBack is true', () => {
    render(() => (
      <Header
        title="Settings"
        showBack={true}
        onBack={() => {}}
        onSettings={() => {}}
        showSettings={false}
      />
    ))
    expect(screen.getByLabelText('Go back')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn()
    render(() => (
      <Header
        title="Settings"
        showBack={true}
        onBack={onBack}
        onSettings={() => {}}
        showSettings={false}
      />
    ))
    fireEvent.click(screen.getByLabelText('Go back'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows settings button when showSettings is true', () => {
    render(() => (
      <Header
        title="Fuel Cost"
        showBack={false}
        onBack={() => {}}
        onSettings={() => {}}
        showSettings={true}
      />
    ))
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })
})
