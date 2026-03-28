import {
  parseDistanceText,
  calcTripCost,
  convertDistance,
  formatCost,
} from '@utils/calculator/calculator'
import { AVERAGE_CAR_ID, type AppState } from '@utils/types/types'
import injectedCss from './injected.css?inline'

const FUEL_COST_HOST_ATTR = 'data-fuel-cost-host'

let observer: MutationObserver | null = null
let processedNodes = new WeakSet<Node>()
let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function getState(): Promise<AppState | null> {
  try {
    return await chrome.runtime.sendMessage({ type: 'GET_APP_STATE' })
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

async function processDistanceNode(textNode: Text) {
  if (processedNodes.has(textNode)) return

  const text = textNode.textContent?.trim()
  if (!text) return

  const parsed = parseDistanceText(text)
  if (!parsed) return

  const parentEl = textNode.parentElement
  if (!parentEl) return

  if (parentEl.querySelector(`[${FUEL_COST_HOST_ATTR}]`)) return
  if (parentEl.closest(`[${FUEL_COST_HOST_ATTR}]`)) return

  processedNodes.add(textNode)

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

  const el = createFuelCostElement(primaryCost, comparisonCost, comparisonLabel)

  try {
    parentEl.appendChild(el)
  } catch {
    // Parent may have been removed between check and insertion
  }
}

function scanForDistances() {
  try {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const text = node.textContent?.trim() ?? ''
        if (processedNodes.has(node)) return NodeFilter.FILTER_REJECT
        if (/^\d[\d,.]*\s*(km|mi|miles?)$/i.test(text)) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_REJECT
      },
    })

    const nodes: Text[] = []
    let current: Text | null
    while ((current = walker.nextNode() as Text | null)) {
      nodes.push(current)
    }

    for (const node of nodes) {
      processDistanceNode(node)
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

// Re-scan when the URL changes (SPA navigation in Maps)
let lastUrl = location.href
const urlCheckInterval = setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href
    processedNodes = new WeakSet()
    removeExistingHosts()
    debouncedScan()
  }
}, 1000)

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  clearInterval(urlCheckInterval)
  if (debounceTimer) clearTimeout(debounceTimer)
  removeExistingHosts()
})

// Start
try {
  startObserver()
} catch (e) {
  console.error('[Fuel Cost] Failed to start content script:', e)
}
