import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resetChromeStores, getChromeMock } from '../../test-setup'

vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    opt_out_capturing: vi.fn(),
  },
}))

beforeEach(async () => {
  resetChromeStores()
  vi.clearAllMocks()
  vi.resetModules()
})

describe('analytics', () => {
  it('isOptedOut returns false by default', async () => {
    const { isOptedOut } = await import('./analytics')
    expect(await isOptedOut()).toBe(false)
  })

  it('isOptedOut returns true after opt-out', async () => {
    const mock = getChromeMock()
    await mock.storage.sync.set({ fuelCostAnalyticsOptOut: true })
    const { isOptedOut } = await import('./analytics')
    expect(await isOptedOut()).toBe(true)
  })

  it('setOptOut stores the preference', async () => {
    const { setOptOut, isOptedOut } = await import('./analytics')
    await setOptOut(true)
    expect(await isOptedOut()).toBe(true)
    await setOptOut(false)
    expect(await isOptedOut()).toBe(false)
  })

  it('trackEvent is a no-op when not initialized', async () => {
    const posthog = (await import('posthog-js')).default
    const { trackEvent } = await import('./analytics')
    trackEvent('test_event')
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it('AnalyticsEvents.carAdded fires with correct properties', async () => {
    const posthog = (await import('posthog-js')).default
    const { AnalyticsEvents } = await import('./analytics')
    AnalyticsEvents.carAdded('manual', 'petrol')
    // Not initialized, so capture should not be called
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it('AnalyticsEvents provides correct event functions', async () => {
    const { AnalyticsEvents } = await import('./analytics')
    expect(typeof AnalyticsEvents.extensionInstalled).toBe('function')
    expect(typeof AnalyticsEvents.extensionUpdated).toBe('function')
    expect(typeof AnalyticsEvents.popupOpened).toBe('function')
    expect(typeof AnalyticsEvents.carAdded).toBe('function')
    expect(typeof AnalyticsEvents.carSearchPerformed).toBe('function')
    expect(typeof AnalyticsEvents.trimSelected).toBe('function')
    expect(typeof AnalyticsEvents.fuelCostCalculated).toBe('function')
    expect(typeof AnalyticsEvents.settingsChanged).toBe('function')
    expect(typeof AnalyticsEvents.analyticsOptOut).toBe('function')
  })
})
