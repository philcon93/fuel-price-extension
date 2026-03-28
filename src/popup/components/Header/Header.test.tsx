import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import { Header } from './Header'

describe('Header', () => {
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

  it('hides back button when showBack is false', () => {
    render(() => (
      <Header
        title="Fuel Cost"
        showBack={false}
        onBack={() => {}}
        onSettings={() => {}}
        showSettings={false}
      />
    ))
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument()
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

  it('hides settings button when showSettings is false', () => {
    render(() => (
      <Header
        title="Fuel Cost"
        showBack={false}
        onBack={() => {}}
        onSettings={() => {}}
        showSettings={false}
      />
    ))
    expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument()
  })

  it('calls onSettings when settings button is clicked', () => {
    const onSettings = vi.fn()
    render(() => (
      <Header
        title="Fuel Cost"
        showBack={false}
        onBack={() => {}}
        onSettings={onSettings}
        showSettings={true}
      />
    ))
    fireEvent.click(screen.getByLabelText('Settings'))
    expect(onSettings).toHaveBeenCalledOnce()
  })
})
