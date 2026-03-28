import { fetchFuelPrices } from '@utils/fuelPrices'
import { getAppState, updateFuelPrices } from '@utils/storage'
import { recordTrip, getRecentTrips, getTripStats, clearTripHistory } from '@utils/tripHistory'

const ALARM_NAME = 'refreshFuelPrices'

chrome.runtime.onInstalled.addListener(async (details) => {
  await getAppState()

  if (details.reason === 'install') {
    await chrome.storage.sync.set({ fuelCostInstallEvent: 'installed' })
  } else if (details.reason === 'update') {
    const manifest = chrome.runtime.getManifest()
    await chrome.storage.sync.set({ fuelCostUpdateEvent: manifest.version })
  }

  try {
    const prices = await fetchFuelPrices(true)
    await updateFuelPrices(prices)
  } catch (e) {
    console.error('[Fuel Cost] Failed to fetch initial prices:', e)
  }

  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 24 * 60,
  })
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return

  try {
    const prices = await fetchFuelPrices(true)
    await updateFuelPrices(prices)
  } catch (e) {
    console.error('[Fuel Cost] Failed to refresh prices:', e)
  }
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_APP_STATE') {
    getAppState().then(sendResponse)
    return true
  }

  if (message.type === 'REFRESH_PRICES') {
    fetchFuelPrices(true)
      .then(async (prices) => {
        await updateFuelPrices(prices)
        sendResponse(prices)
      })
      .catch((e) => {
        console.error('[Fuel Cost] Price refresh failed:', e)
        sendResponse(null)
      })
    return true
  }

  if (message.type === 'CAR_QUERY_FETCH') {
    fetch(message.url)
      .then((res) => res.json())
      .then(sendResponse)
      .catch(() => sendResponse(null))
    return true
  }

  if (message.type === 'RECORD_TRIP') {
    recordTrip(message.trip).then(() => sendResponse(true))
    return true
  }

  if (message.type === 'GET_TRIP_HISTORY') {
    getRecentTrips(message.limit)
      .then(sendResponse)
      .catch(() => sendResponse([]))
    return true
  }

  if (message.type === 'GET_TRIP_STATS') {
    getTripStats()
      .then(sendResponse)
      .catch(() => sendResponse({ totalTrips: 0, totalCost: 0, totalDistanceKm: 0 }))
    return true
  }

  if (message.type === 'TRACK_FUEL_CALC') {
    sendResponse(true)
    return false
  }

  if (message.type === 'CLEAR_TRIP_HISTORY') {
    clearTripHistory()
      .then(() => sendResponse(true))
      .catch(() => sendResponse(false))
    return true
  }
})
