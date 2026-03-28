import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resetChromeStores, getChromeMock } from '../test-setup'

beforeEach(() => {
  resetChromeStores()
  vi.restoreAllMocks()
})

describe('background service worker', () => {
  it('registers an onInstalled listener', async () => {
    await import('./index')
    const mock = getChromeMock()
    expect(mock.runtime.onInstalled.addListener).toHaveBeenCalled()
  })

  it('registers an alarm listener', async () => {
    await import('./index')
    const mock = getChromeMock()
    expect(mock.alarms.onAlarm.addListener).toHaveBeenCalled()
  })

  it('registers a message listener', async () => {
    await import('./index')
    const mock = getChromeMock()
    expect(mock.runtime.onMessage.addListener).toHaveBeenCalled()
  })

  it('creates an alarm on install', async () => {
    const { getInstallListeners } = await import('../test-setup')
    await import('./index')
    const listeners = getInstallListeners()
    expect(listeners.length).toBeGreaterThan(0)

    const mock = getChromeMock()
    await listeners[0]({ reason: 'install' })
    expect(mock.alarms.create).toHaveBeenCalledWith('refreshFuelPrices', {
      periodInMinutes: 24 * 60,
    })
  })
})
