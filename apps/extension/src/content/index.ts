import { STORAGE_KEY } from './constants'
import { clearStateCache } from './stateCache'
import { removeExistingHosts } from './fuelCostElement'
import {
  scanForDistances,
  debouncedScan,
  resetProcessedNodes,
  cancelDebouncedScan,
} from './distanceScanner'

let observer: MutationObserver | null = null

function startObserver() {
  if (observer) observer.disconnect()

  resetProcessedNodes()
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
  clearStateCache()
  resetProcessedNodes()
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
  cancelDebouncedScan()
  removeExistingHosts()
})

try {
  startObserver()
} catch (e) {
  console.error('[Fuel Cost] Failed to start content script:', e)
}
