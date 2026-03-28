import { render } from 'solid-js/web'
import { App } from './App'
import { initAnalytics, AnalyticsEvents } from '@utils/analytics'

async function processDeferredEvents() {
  try {
    const result = await chrome.storage.sync.get(['fuelCostInstallEvent', 'fuelCostUpdateEvent'])
    if (result.fuelCostInstallEvent) {
      AnalyticsEvents.extensionInstalled()
      await chrome.storage.sync.remove('fuelCostInstallEvent')
    }
    if (result.fuelCostUpdateEvent) {
      AnalyticsEvents.extensionUpdated(result.fuelCostUpdateEvent as string)
      await chrome.storage.sync.remove('fuelCostUpdateEvent')
    }
  } catch {
    // Non-critical
  }
}

const root = document.getElementById('root')
if (root) {
  render(() => <App />, root)
  initAnalytics().then(() => {
    AnalyticsEvents.popupOpened()
    processDeferredEvents()
  })
}
