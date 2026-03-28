import { parseDistanceText, calcTripCost, convertDistance, formatCost } from '@utils/calculator'
import { AVERAGE_CAR_ID } from '@utils/types'
import { FUEL_COST_HOST_ATTR, DISTANCE_PATTERN } from '../constants'
import { getState } from '../stateCache'
import { createFuelCostElement } from '../fuelCostElement'
import { queueTrip } from '../tripRecorder'

let processedNodes = new WeakSet<Node>()
let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function extractDistance(text: string): { value: number; unit: 'km' | 'miles' } | null {
  const cleaned = text.replace(/\u00A0/g, ' ').trim()
  return parseDistanceText(cleaned)
}

export async function processDistanceElement(el: Element, distanceText: string): Promise<void> {
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
    return
  }

  queueTrip({
    timestamp: Date.now(),
    distanceKm,
    fuelCost: cost,
    carId: activeCar.id,
    carNickname: activeCar.nickname,
    fuelType: activeCar.fuelType,
    currency: state.settings.currency,
  })
}

export function scanForDistances(): void {
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

export function debouncedScan(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    scanForDistances()
  }, 500)
}

export function resetProcessedNodes(): void {
  processedNodes = new WeakSet()
}

export function cancelDebouncedScan(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}
