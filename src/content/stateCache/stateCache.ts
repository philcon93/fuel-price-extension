import type { AppState } from '@utils/types'
import { STORAGE_KEY } from '../constants'

let cachedState: AppState | null = null
const CACHE_TTL_MS = 10_000

export async function getState(): Promise<AppState | null> {
  try {
    if (cachedState) return cachedState
    const result = await chrome.storage.sync.get(STORAGE_KEY)
    const state = (result[STORAGE_KEY] as AppState) ?? null
    if (state) {
      cachedState = state
      setTimeout(() => {
        cachedState = null
      }, CACHE_TTL_MS)
    }
    return state
  } catch {
    return null
  }
}

export function clearStateCache(): void {
  cachedState = null
}
