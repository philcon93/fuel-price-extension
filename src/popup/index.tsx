import { render } from 'solid-js/web'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { I18nProvider } from '@utils/i18n'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.fuelCostTrips) {
    queryClient.invalidateQueries({ queryKey: ['tripHistory'] })
    queryClient.invalidateQueries({ queryKey: ['tripStats'] })
  }
})

const root = document.getElementById('root')
if (root) {
  render(
    () => (
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </QueryClientProvider>
    ),
    root,
  )
  initAnalytics().then(() => {
    AnalyticsEvents.popupOpened()
    processDeferredEvents()
  })
}
