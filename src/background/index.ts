import { fetchFuelPrices } from '@utils/fuelPrices'
import { getAppState, updateFuelPrices } from '@utils/storage'

const ALARM_NAME = 'refreshFuelPrices'

chrome.runtime.onInstalled.addListener(async () => {
  await getAppState()

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
})
