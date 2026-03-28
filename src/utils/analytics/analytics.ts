import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string) || 'https://us.i.posthog.com'
const OPT_OUT_KEY = 'fuelCostAnalyticsOptOut'

let initialized = false

export async function initAnalytics(): Promise<void> {
  if (initialized || !POSTHOG_KEY) return

  const optedOut = await isOptedOut()
  if (optedOut) return

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    persistence: 'localStorage',
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
  })

  initialized = true
}

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (!initialized) return
  posthog.capture(event, properties)
}

export async function isOptedOut(): Promise<boolean> {
  try {
    const result = await chrome.storage.sync.get(OPT_OUT_KEY)
    return result[OPT_OUT_KEY] === true
  } catch {
    return false
  }
}

export async function setOptOut(optOut: boolean): Promise<void> {
  await chrome.storage.sync.set({ [OPT_OUT_KEY]: optOut })

  if (optOut && initialized) {
    posthog.opt_out_capturing()
    initialized = false
  } else if (!optOut && !initialized) {
    await initAnalytics()
  }
}

function bucketDistance(km: number): string {
  if (km < 5) return '0-5km'
  if (km < 10) return '5-10km'
  if (km < 25) return '10-25km'
  if (km < 50) return '25-50km'
  if (km < 100) return '50-100km'
  if (km < 250) return '100-250km'
  return '250km+'
}

export const AnalyticsEvents = {
  extensionInstalled: () => trackEvent('extension_installed'),

  extensionUpdated: (version: string) => trackEvent('extension_updated', { version }),

  popupOpened: () => trackEvent('popup_opened'),

  carAdded: (method: 'lookup' | 'manual', fuelType: string) =>
    trackEvent('car_added', { method, fuel_type: fuelType }),

  carSearchPerformed: (queryLength: number, resultsCount: number) =>
    trackEvent('car_search_performed', {
      query_length: queryLength,
      results_count: resultsCount,
    }),

  trimSelected: (fuelType: string) => trackEvent('trim_selected', { fuel_type: fuelType }),

  fuelCostCalculated: (distanceKm: number, fuelType: string) =>
    trackEvent('fuel_cost_calculated', {
      distance_bucket: bucketDistance(distanceKm),
      fuel_type: fuelType,
    }),

  settingsChanged: (setting: string, value: string) =>
    trackEvent('settings_changed', { setting, value }),

  analyticsOptOut: (optedOut: boolean) => trackEvent('analytics_opt_out', { opted_out: optedOut }),
} as const
