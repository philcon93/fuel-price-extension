import { parseDistanceText, calcTripCost, convertDistance, formatCost } from '@utils/calculator'
import { AVERAGE_CAR_ID, type AppState, type TripRecord } from '@utils/types'
import injectedCss from './injected.css?inline'

const TRIP_STORAGE_KEY = 'fuelCostTrips'
const MAX_TRIPS = 200
const DEDUP_WINDOW_MS = 30_000

async function recordTripToStorage(trip: Omit<TripRecord, 'id'>): Promise<void> {
  try {
    const result = await chrome.storage.local.get(TRIP_STORAGE_KEY)
    const stored = result[TRIP_STORAGE_KEY] as { trips?: TripRecord[] } | undefined
    const existing: TripRecord[] = stored?.trips ?? []

    const cutoff = trip.timestamp - DEDUP_WINDOW_MS
    const isDuplicate = existing.some(
      (t) =>
        t.timestamp >= cutoff &&
        t.carId === trip.carId &&
        Math.abs(t.distanceKm - trip.distanceKm) < 0.1 &&
        Math.abs(t.fuelCost - trip.fuelCost) < 0.01,
    )
    if (isDuplicate) return

    const newTrip: TripRecord = { ...trip, id: Date.now() }
    const updated = [newTrip, ...existing].slice(0, MAX_TRIPS)
    await chrome.storage.local.set({ [TRIP_STORAGE_KEY]: { trips: updated } })
  } catch {
    // Non-critical — trip recording failure shouldn't break the UI
  }
}

const FUEL_COST_HOST_ATTR = 'data-fuel-cost-host'
const STORAGE_KEY = 'fuelCostAppState'

let observer: MutationObserver | null = null
let processedNodes = new WeakSet<Node>()
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let cachedState: AppState | null = null

async function getState(): Promise<AppState | null> {
  try {
    if (cachedState) return cachedState
    const result = await chrome.storage.sync.get(STORAGE_KEY)
    const state = (result[STORAGE_KEY] as AppState) ?? null
    if (state) {
      cachedState = state
      setTimeout(() => {
        cachedState = null
      }, 10_000)
    }
    return state
  } catch {
    return null
  }
}

function removeExistingHosts() {
  document.querySelectorAll(`[${FUEL_COST_HOST_ATTR}]`).forEach((el) => el.remove())
}

function createFuelCostElement(
  primaryCost: string,
  comparisonCost?: string,
  comparisonLabel?: string,
): HTMLElement {
  const host = document.createElement('span')
  host.setAttribute(FUEL_COST_HOST_ATTR, 'true')
  host.style.display = 'inline-flex'
  host.style.alignItems = 'center'
  host.style.marginLeft = '6px'
  const shadow = host.attachShadow({ mode: 'closed' })

  const style = document.createElement('style')
  style.textContent = injectedCss
  shadow.appendChild(style)

  const container = document.createElement('span')
  container.className = 'fuel-cost-container'

  const icon = document.createElement('span')
  icon.className = 'fuel-cost-icon'
  icon.textContent = '\u26FD'
  container.appendChild(icon)

  const primary = document.createElement('span')
  primary.className = 'fuel-cost-primary'
  primary.textContent = primaryCost
  container.appendChild(primary)

  if (comparisonCost && comparisonLabel) {
    const sep = document.createElement('span')
    sep.className = 'fuel-cost-separator'
    sep.textContent = '\u00B7'
    container.appendChild(sep)

    const comp = document.createElement('span')
    comp.className = 'fuel-cost-comparison'

    const label = document.createElement('span')
    label.className = 'fuel-cost-label'
    label.textContent = `${comparisonLabel}: `
    comp.appendChild(label)
    comp.appendChild(document.createTextNode(comparisonCost))
    container.appendChild(comp)
  }

  shadow.appendChild(container)
  return host
}

const DISTANCE_PATTERN = /(\d[\d,.]*)\s*(km|mi|miles?)\b/i

function extractDistance(text: string): { value: number; unit: 'km' | 'miles' } | null {
  const cleaned = text.replace(/\u00A0/g, ' ').trim()
  return parseDistanceText(cleaned)
}

async function processDistanceElement(el: Element, distanceText: string) {
  if (el.querySelector(`[${FUEL_COST_HOST_ATTR}]`)) return
  if (el.closest(`[${FUEL_COST_HOST_ATTR}]`)) return

  const parsed = extractDistance(distanceText)
  if (!parsed) return

  const state = await getState()
  if (!state) return

  const distanceKm = convertDistance(parsed.value, parsed.unit, 'km')
  const activeCar = state.cars.find((c) => c.id === state.activeCarId)
  if (!activeCar) return

  const cost = calcTripCost(distanceKm, activeCar, state.fuelPrices)
  const primaryCost = formatCost(cost, state.settings.currency)

  let comparisonCost: string | undefined
  let comparisonLabel: string | undefined

  if (state.settings.showAverageComparison && state.activeCarId !== AVERAGE_CAR_ID) {
    const avgCar = state.cars.find((c) => c.id === AVERAGE_CAR_ID)
    if (avgCar) {
      const avgCostValue = calcTripCost(distanceKm, avgCar, state.fuelPrices)
      comparisonCost = formatCost(avgCostValue, state.settings.currency)
      comparisonLabel = 'Avg'
    }
  }

  const costEl = createFuelCostElement(primaryCost, comparisonCost, comparisonLabel)

  try {
    el.appendChild(costEl)
  } catch {
    // Parent may have been removed between check and insertion
    return
  }

  recordTripToStorage({
    timestamp: Date.now(),
    distanceKm,
    fuelCost: cost,
    carId: activeCar.id,
    carNickname: activeCar.nickname,
    fuelType: activeCar.fuelType,
    currency: state.settings.currency,
  })
}

function scanForDistances() {
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (processedNodes.has(node)) return NodeFilter.FILTER_REJECT
        const text = (node.textContent ?? '').replace(/\u00A0/g, ' ').trim()
        if (!text) return NodeFilter.FILTER_REJECT
        if (DISTANCE_PATTERN.test(text)) return NodeFilter.FILTER_ACCEPT
        return NodeFilter.FILTER_REJECT
      },
    })

    const nodes: Text[] = []
    let current: Text | null
    while ((current = walker.nextNode() as Text | null)) {
      nodes.push(current)
    }

    for (const node of nodes) {
      processedNodes.add(node)
      const text = (node.textContent ?? '').replace(/\u00A0/g, ' ').trim()
      const parentEl = node.parentElement
      if (!parentEl) continue
      processDistanceElement(parentEl, text)
    }
  } catch (e) {
    console.error('[Fuel Cost] Scan error:', e)
  }
}

function debouncedScan() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    scanForDistances()
  }, 500)
}

function startObserver() {
  if (observer) observer.disconnect()

  processedNodes = new WeakSet()
  removeExistingHosts()
  scanForDistances()

  observer = new MutationObserver((mutations) => {
    let shouldScan = false
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldScan = true
        break
      }
      if (mutation.type === 'characterData') {
        shouldScan = true
        break
      }
    }
    if (shouldScan) debouncedScan()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  })
}

function refreshCosts() {
  cachedState = null
  processedNodes = new WeakSet()
  removeExistingHosts()
  debouncedScan()
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes[STORAGE_KEY]) {
    refreshCosts()
  }
})

let lastUrl = location.href
const urlCheckInterval = setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href
    refreshCosts()
  }
}, 1000)

window.addEventListener('beforeunload', () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  clearInterval(urlCheckInterval)
  if (debounceTimer) clearTimeout(debounceTimer)
  removeExistingHosts()
})

try {
  startObserver()
} catch (e) {
  console.error('[Fuel Cost] Failed to start content script:', e)
}
