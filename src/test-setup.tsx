import { vi, afterEach } from 'vitest'
import { cleanup } from '@solidjs/testing-library'
import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import type { JSX } from 'solid-js'

afterEach(() => {
  cleanup()
})

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  })
}

export function withQueryProvider(ui: () => JSX.Element): () => JSX.Element {
  const client = createTestQueryClient()
  return () => <QueryClientProvider client={client}>{ui()}</QueryClientProvider>
}

const syncStore: Record<string, unknown> = {}
const localStore: Record<string, unknown> = {}

const installListeners: Array<(details: unknown) => void> = []
const alarmListeners: Array<(alarm: { name: string }) => void> = []
const messageListeners: Array<
  (message: unknown, sender: unknown, sendResponse: (r: unknown) => void) => boolean | void
> = []

const chromeMock = {
  storage: {
    sync: {
      get: vi.fn(async (keys: string | string[]) => {
        if (Array.isArray(keys)) {
          const result: Record<string, unknown> = {}
          for (const key of keys) {
            if (syncStore[key] !== undefined) result[key] = syncStore[key]
          }
          return result
        }
        return { [keys]: syncStore[keys] ?? undefined }
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        Object.assign(syncStore, items)
      }),
      remove: vi.fn(async (keys: string | string[]) => {
        const keyList = Array.isArray(keys) ? keys : [keys]
        for (const key of keyList) delete syncStore[key]
      }),
    },
    local: {
      get: vi.fn(async (key: string) => ({ [key]: localStore[key] ?? undefined })),
      set: vi.fn(async (items: Record<string, unknown>) => {
        Object.assign(localStore, items)
      }),
    },
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn((cb: (details: unknown) => void) => installListeners.push(cb)),
    },
    onMessage: {
      addListener: vi.fn(
        (
          cb: (
            message: unknown,
            sender: unknown,
            sendResponse: (r: unknown) => void,
          ) => boolean | void,
        ) => messageListeners.push(cb),
      ),
    },
    sendMessage: vi.fn(),
  },
  alarms: {
    create: vi.fn(),
    onAlarm: {
      addListener: vi.fn((cb: (alarm: { name: string }) => void) => alarmListeners.push(cb)),
    },
  },
}

Object.defineProperty(globalThis, 'chrome', { value: chromeMock, writable: true })

export function resetChromeStores() {
  for (const key of Object.keys(syncStore)) delete syncStore[key]
  for (const key of Object.keys(localStore)) delete localStore[key]
}

export function getChromeMock() {
  return chromeMock
}

export function getInstallListeners() {
  return installListeners
}

export function getAlarmListeners() {
  return alarmListeners
}

export function getMessageListeners() {
  return messageListeners
}
