# ⛽ Fuel Cost Chrome Extension — Full Project Plan

## Vision

A Chrome extension that injects fuel cost information directly into Google Maps whenever a route is displayed. Users see the cost of their journey in their local currency, based on their specific car and live fuel prices — right next to the distance Google Maps already shows. No separate app, no tab switching, no manual input required after initial setup.

This fills a real gap: existing extensions in this space are unreliable, geo-locked, require manual MPG and fuel price input, and none support car lookup by name or multiple car profile comparison.

---

## How It Works (User Flow)

1. User installs the extension
2. On first open, popup shows with the default "Average Car" profile active — works immediately, no setup required
3. User can optionally add their own car by typing e.g. "Corolla 2023 hybrid" — extension looks up the engine and efficiency
4. If multiple trims match, user picks from a list
5. If car isn't found, user enters fuel type, engine size, and L/100km manually
6. Whenever the user plans a route on Google Maps, the extension injects the fuel cost next to the distance
7. If a custom car is active and the "show average" toggle is on, both costs are shown for comparison

---

## Market Research

Existing extensions have a ceiling of ~4,000 users and persistent complaints:

- Unreliable — fails to show up, NaN bugs
- Manual fuel price input only
- Geo-locked (US/Canada or Europe only)
- No car lookup by name
- No multiple car profiles
- No comparison to average

**Key differentiators of this extension:**

- Car lookup by name (type "Corolla 2023 hybrid", it figures out the rest)
- Truly global — currency auto-detected, fuel prices auto-fetched per region
- Multiple saved car profiles with side-by-side comparison
- Average car baseline always available as a reference point
- Live fuel prices, refreshed daily, no manual input needed
- Built on modern stack (Vite + SolidJS) for reliability and performance

---

## Tech Stack

| Layer              | Technology              | Reason                                                   |
| ------------------ | ----------------------- | -------------------------------------------------------- |
| Build tool         | Vite                    | Fast, modern, excellent DX                               |
| UI framework       | SolidJS                 | Tiny bundle, fine-grained reactivity, perfect for popup  |
| Styling            | Vanilla Extract         | Zero-runtime, type-safe CSS-in-TS, build-time extraction |
| Language           | TypeScript              | Type safety across API shapes and shared models          |
| Extension standard | Chrome Manifest V3      | Required for Chrome Web Store                            |
| Vite plugin        | @crxjs/vite-plugin      | Handles HMR and manifest wiring for extensions           |
| Content script     | Vanilla TS + Shadow DOM | Isolated from Google Maps CSS, no framework needed       |
| Background worker  | Vanilla TS              | Service worker context, no framework needed              |
| Storage            | chrome.storage.sync     | Roams with user's Google account                         |
| Cache              | chrome.storage.local    | Fuel price cache with timestamp                          |

No backend required. All APIs used are free, public, and CORS-friendly.

---

## Project Structure

```
fuel-extension/
├── LICENSE                            # PolyForm Noncommercial 1.0.0
├── manifest.json
├── vite.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── popup/
│   │   ├── index.html
│   │   ├── index.tsx                  # SolidJS entry point
│   │   ├── App.tsx                    # Root component, manages view state
│   │   ├── styles/
│   │   │   ├── theme.css.ts           # Design tokens — colours, spacing, typography
│   │   │   ├── global.css.ts          # Global resets and base styles
│   │   │   └── sprinkles.css.ts       # Utility classes via @vanilla-extract/sprinkles
│   │   └── components/
│   │       ├── Header.tsx
│   │       ├── Header.css.ts          # Component-scoped styles
│   │       ├── Home.tsx
│   │       ├── Home.css.ts
│   │       ├── CarSearch.tsx
│   │       ├── CarSearch.css.ts
│   │       ├── TrimPicker.tsx
│   │       ├── TrimPicker.css.ts
│   │       ├── ManualEntry.tsx
│   │       ├── ManualEntry.css.ts
│   │       ├── CarList.tsx
│   │       ├── CarList.css.ts
│   │       ├── Settings.tsx
│   │       └── Settings.css.ts
│   ├── content/
│   │   ├── index.ts                   # MutationObserver, Shadow DOM injector
│   │   └── injected.css               # Plain CSS for Shadow DOM (not VE — see Styling note)
│   ├── background/
│   │   └── index.ts                   # Service worker, fuel price fetcher
│   └── utils/
│       ├── carLookup.ts
│       ├── fuelPrices.ts
│       ├── calculator.ts
│       ├── storage.ts
│       └── types.ts
└── public/
    └── icons/
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

---

## Dev Setup

```bash
# Create project
npm create vite@latest fuel-extension -- --template solid-ts
cd fuel-extension

# Install dependencies
npm install
npm install -D @crxjs/vite-plugin
npm install -D @vanilla-extract/css @vanilla-extract/vite-plugin
npm install -D @vanilla-extract/sprinkles    # optional utility class system
```

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { crx } from '@crxjs/vite-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [vanillaExtractPlugin(), solidPlugin(), crx({ manifest })],
})
```

Note: `vanillaExtractPlugin()` must come before `solidPlugin()` in the plugins array.

### Dev workflow

```bash
npm run dev     # builds to dist/, watches for changes, popup HMR works automatically
npm run build   # production build for Chrome Web Store submission
```

Loading in Chrome:

1. Go to chrome://extensions
2. Enable Developer Mode
3. Load Unpacked → select the dist/ folder
4. For content/background script changes, click the refresh icon on the extension card

---

## Styling Approach

### Popup — Vanilla Extract

All popup styles use Vanilla Extract (`.css.ts` files). VE extracts styles at build time into real CSS — zero runtime overhead, full TypeScript type safety on class names and tokens.

Design tokens are defined once in `theme.css.ts` using `createTheme` and shared across all components:

```ts
// src/popup/styles/theme.css.ts
import { createTheme } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  color: {
    bg: '#ffffff',
    surface: '#f8f9fa',
    border: '#e0e0e0',
    text: '#1a1a1a',
    textMuted: '#6b6b6b',
    accent: '#1a73e8', // Google blue — blends with Maps UI
    accentHover: '#1557b0',
    danger: '#d93025',
    success: '#188038',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  font: {
    size: {
      sm: '12px',
      base: '14px',
      lg: '16px',
    },
    family: "-apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  radius: {
    sm: '4px',
    md: '8px',
    full: '9999px',
  },
})
```

Component styles reference vars:

```ts
// src/popup/components/Header.css.ts
import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css.ts'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  fontSize: vars.font.size.lg,
  fontFamily: vars.font.family,
})
```

### Content Script — Shadow DOM with plain CSS

Vanilla Extract is a build-time tool — it cannot run inside a content script that executes in the browser page context. Instead, the injected fuel cost element uses a **Shadow DOM** with a plain CSS file (`injected.css`) that Vite bundles and the content script injects at runtime.

```ts
// src/content/index.ts
const host = document.createElement('div')
const shadow = host.attachShadow({ mode: 'closed' })

// Inject styles into shadow root — fully isolated from Google Maps CSS
const style = document.createElement('style')
style.textContent = INJECTED_CSS // inlined by Vite at build time
shadow.appendChild(style)

// Inject fuel cost UI into shadow root
const el = document.createElement('div')
el.className = 'fuel-cost'
el.textContent = `⛽ ${formattedCost}`
shadow.appendChild(el)
```

This means Google Maps can never accidentally override the injected element's styles, and the extension's styles can never leak into and break Google Maps.

---

## TypeScript Types (types.ts)

```ts
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'phev' | 'electric'
export type DistanceUnit = 'km' | 'miles'
export type EfficiencyUnit = 'l100km' | 'mpg' | 'kwh100km'
export type Currency = 'AUD' | 'USD' | 'GBP' | 'EUR' | 'NZD' // extensible

export interface CarProfile {
  id: string // uuid
  nickname: string // "My Corolla", "Sarah's Ranger", "Average Car"
  isDefault: boolean // true only for Average Car
  isLocked: boolean // true only for Average Car — cannot edit or delete

  // From lookup or manual entry
  make?: string
  model?: string
  year?: number
  trim?: string
  fuelType: FuelType
  engineSizeL?: number

  // Efficiency
  officialL100km?: number // from manufacturer data
  realWorldL100km?: number // from lookup or user override
  useRealWorld: boolean

  // EV specific
  kWh100km?: number

  isManual: boolean // true if user typed values manually
}

export interface UserSettings {
  distanceUnit: DistanceUnit
  efficiencyUnit: EfficiencyUnit
  currency: Currency
  showAverageComparison: boolean // only respected when activeCarId !== AVERAGE_CAR_ID
}

export interface FuelPrices {
  petrolPerLitre: number
  dieselPerLitre: number
  electricityPerKwh: number
  currency: Currency
  lastUpdated: number // unix timestamp ms
  source: string
}

export interface AppState {
  cars: CarProfile[] // index 0 is always Average Car
  activeCarId: string
  settings: UserSettings
  fuelPrices: FuelPrices
}

export type PopupView = 'home' | 'addCar' | 'editCar' | 'settings'
```

---

## External APIs

### Car Lookup — CarQuery API

- **URL:** http://www.carqueryapi.com/api/0.3/
- **Coverage:** Global, 1941–present, includes Australian-market vehicles
- **Cost:** Free
- **Key endpoints:**
  - `?cmd=getMakes` — list of all makes
  - `?cmd=getModels&make=toyota` — models for a make
  - `?cmd=getTrims&make=toyota&model=corolla&year=2023` — trim variants with engine and fuel data
- **Returns:** make, model, year, trim, engine displacement, fuel type, body style, official fuel economy

### Fuel Prices — GlobePetrolPrices API

- **URL:** https://www.globalpetrolprices.com/api/
- **Coverage:** Global, 150+ countries
- **Cost:** Free tier available
- **Use:** Fetch petrol, diesel, and electricity prices by country code
- **Cache:** Store result in chrome.storage.local with timestamp, refresh if older than 24 hours
- **Fallback:** If API unavailable, use hardcoded recent averages per country as a last resort

### Currency Detection

- Use `Intl.NumberFormat().resolvedOptions().locale` from the browser
- Map locale to currency (en-AU → AUD, en-US → USD, en-GB → GBP, etc.)
- User can override in Settings

---

## Algorithms

### Fuel consumption

```ts
// Petrol / Diesel
litres = (distanceKm / 100) * l100km

// EV
kWh = (distanceKm / 100) * kWh100km
kWhWithChargingLoss = kWh / 0.88 // ~88% charging efficiency

// Hybrid (PHEV)
// Use electric range first, then petrol for remainder
electricKm = Math.min(distanceKm, electricRangeKm)
petrolKm = Math.max(0, distanceKm - electricRangeKm)
litres = (petrolKm / 100) * l100km
kWh = (electricKm / 100) * kWh100km
```

### Cost calculation

```ts
// Petrol / Diesel
cost = litres * pricePerLitre

// EV
cost = kWhWithChargingLoss * pricePerKwh

// Display
// Round to 2 decimal places
// Format with local currency symbol
```

### Distance parsing from Google Maps DOM

```ts
// Google Maps shows distance as e.g. "12.3 km" or "7.6 mi"
// Parse value and unit from injected text node
const match = distanceText.match(/^([\d.]+)\s*(km|mi|miles?)$/i)
const value = parseFloat(match[1])
const unit = match[2].startsWith('mi') ? 'miles' : 'km'
const distanceKm = unit === 'miles' ? value * 1.60934 : value
```

### Average Car baseline

Per-country fleet average L/100km values hardcoded as defaults:

- Australia: 11.1 L/100km (petrol fleet average)
- USA: 10.7 L/100km
- UK: 8.9 L/100km
- EU: 7.8 L/100km
- Global fallback: 10.0 L/100km

Detected from browser locale, used for the locked Average Car profile.

---

## Content Script (content/index.ts)

This is the most fragile piece — Google Maps is a heavily dynamic React app.

Strategy:

1. On load, set up a `MutationObserver` on `document.body`
2. Watch for DOM nodes that contain distance text matching the pattern
3. When found, parse distance, fetch car profile and fuel prices from storage
4. Create a Shadow DOM host element and attach a closed shadow root
5. Inject `injected.css` into the shadow root for fully isolated styles
6. Render the fuel cost UI inside the shadow root
7. Insert the host element into the Google Maps DOM adjacent to the distance
8. Store a reference to the host element
9. When observer fires again (route changed), remove old host and re-inject
10. Clean up observer on extension unload

**Why Shadow DOM:** Google Maps' own styles can never override the injected element, and the extension styles can never leak into Maps and cause breakage. This makes the injection far more resilient across Maps updates.

Key challenge: Google may change their DOM structure. The selector targeting the distance element should be as resilient as possible — prefer text content matching over class names (which are often obfuscated and change frequently).

```ts
// Resilient approach: find text nodes matching distance pattern
// rather than relying on CSS class selectors
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode: (node) => {
    return /^\d+(\.\d+)?\s*(km|mi)$/.test(node.textContent?.trim() ?? '')
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_REJECT
  },
})
```

---

## Popup UI Views

### Home view

- Header: "⛽ Fuel Cost" title + gear icon (→ Settings)
- Active car dropdown (select from saved profiles)
- If active car is not Average Car: show efficiency and fuel type summary
- "+ Add a car" link (→ AddCar view)
- Current fuel prices shown (petrol/diesel/electricity) with last updated time

### AddCar / EditCar view

- Header: back arrow + "Add a car" or "Edit car"
- Search input: "Search your car e.g. Corolla 2023 hybrid"
- Results list: shows matching trims for disambiguation
- OR manual entry fields (shown if no results, or via "Enter manually" toggle):
  - Nickname (text input)
  - Fuel type (select: Petrol / Diesel / Hybrid / PHEV / Electric)
  - Engine size (select: 1.0 / 1.2 / 1.5 / 1.8 / 2.0 / 2.5 / 3.0 / 3.5+)
  - Efficiency (number input, unit shown based on settings)
- Save button
- Delete button (EditCar only, not shown for Average Car)

### Settings view

- Header: back arrow + "Settings"
- **Units section:**
  - Distance: km / miles
  - Fuel efficiency: L/100km / MPG / kWh/100km
- **Currency section:**
  - Currency selector (AUD, USD, GBP, EUR, NZD, etc.)
- **Display section:**
  - "Show average car cost alongside selected car" toggle
  - Greyed out with hint text if Average Car is the active profile
- **Fuel prices section:**
  - Shows current petrol, diesel, electricity prices with edit buttons
  - Last updated timestamp + source
  - Refresh button

---

## Show Average Toggle Logic

```ts
// In content script injection
const showComparison = settings.showAverageComparison && activeCarId !== AVERAGE_CAR_ID

// Injected display
if (showComparison) {
  // Show both: active car cost AND average car cost
  // e.g. "My Corolla: $2.10 · Average: $3.40"
} else {
  // Show only active car cost
  // e.g. "$2.10"
}
```

Toggle is always visible in Settings but disabled (greyed + tooltip) when Average Car is selected, so users understand why it's unavailable rather than being confused it's missing.

---

## Car Profile Limit (Free vs Paid)

Free tier: maximum 2 saved car profiles (Average Car does not count toward the limit).

When user tries to add a 3rd car on free tier:

- Show upsell prompt: "Upgrade to Pro for unlimited car profiles"
- Do not proceed to AddCar view

This is the only paid gating in v1. All other features are free.

---

## Paid Features (Future)

| Feature                                | Tier                   | Notes                              |
| -------------------------------------- | ---------------------- | ---------------------------------- |
| Unlimited car profiles                 | Pro ~$2-3/mo or $15/yr | Core upsell                        |
| Trip history & monthly spend reporting | Pro                    | Requires local storage of journeys |
| CSV export of trips                    | Pro                    |                                    |
| Multi-stop journey cost breakdown      | Pro                    | Per-leg breakdown                  |
| Fuel price alerts                      | Pro                    | Requires lightweight backend       |
| Trailer/load modifier (+% fuel use)    | Pro                    | Popular in AU for towing caravans  |
| Shared profiles + per-driver reporting | Fleet ~$10-15/mo       | B2B upsell                         |
| Lifetime purchase                      | One-time ~$25-30       | Offer at launch                    |

---

## License

**PolyForm Noncommercial License 1.0.0**

This license allows anyone to use, modify, and share the software freely — but strictly prohibits any commercial use or monetisation by third parties.

The full license text must be in a `LICENSE` file in the root of the repository. The coding agent should create this file with the official PolyForm Noncommercial 1.0.0 text, available at https://polyformproject.org/licenses/noncommercial/1.0.0/

Key points of the license:

- ✅ Free to use personally
- ✅ Free to modify and share
- ✅ Free to use for noncommercial open source projects
- ❌ Cannot sell the software
- ❌ Cannot use it as part of a paid product or service
- ❌ Cannot use it in a business context that generates revenue

The licensor (you) retains the right to offer paid Pro/Fleet tiers of your own product — the license restricts third parties, not you.

---

## Build Order (Step by Step)

Build in this order — each step is independently testable before the next.

### Step 1 — LICENSE

Create the LICENSE file in the repo root with the full PolyForm Noncommercial 1.0.0 text from https://polyformproject.org/licenses/noncommercial/1.0.0/ — fill in the licensor name and year.

### Step 2 — manifest.json

Define permissions, content script URL match patterns, popup entry point, background service worker. Nothing works without this.

Required permissions:

- `storage`
- `activeTab`

Required host_permissions:

- `https://www.google.com/maps/*`
- `https://maps.google.com/*`
- `https://maps.google.com.au/*` (and other regional domains)
- CarQuery API domain
- Fuel price API domain

### Step 3 — vite.config.ts + tsconfig.json + package.json

Get the build pipeline running with Vite + CRXJS + SolidJS + Vanilla Extract. Confirm `npm run dev` produces a dist/ folder that loads in Chrome as an unpacked extension. Confirm a `.css.ts` file compiles correctly.

### Step 4 — theme.css.ts + global.css.ts

Define all design tokens before writing any component styles. Every colour, spacing value, font size, and border radius defined once here. Global CSS resets applied. This is the styling foundation everything else builds on.

### Step 5 — types.ts

Define all shared TypeScript interfaces before writing any logic. CarProfile, UserSettings, FuelPrices, AppState, PopupView.

### Step 6 — popup shell (popup/index.html + App.tsx)

SolidJS entry point with view state signal. Apply themeClass to root element. Render placeholder content for each view. Confirm popup opens in Chrome with correct base styles.

```ts
const [view, setView] = createSignal<PopupView>('home')
```

### Step 7 — utils/carLookup.ts

CarQuery API integration. Functions:

- `searchCars(query: string): Promise<CarResult[]>` — parse natural language input, fetch trims
- `parseQuery(input: string): { make?, model?, year?, keywords[] }` — extract structured fields from free text

Test this in isolation by calling it from the browser console before wiring to UI.

### Step 8 — CarSearch.tsx + TrimPicker.tsx + ManualEntry.tsx

Build the AddCar UI components with Vanilla Extract styles. Wire to carLookup.ts. Confirm search, disambiguation, and manual fallback all work.

### Step 9 — utils/storage.ts

Helpers for reading and writing AppState to chrome.storage.sync. Initialize with default state on first install (Average Car profile, locale-detected settings).

### Step 10 — Home.tsx

Car selector dropdown reading from storage. Switch active car. Link to AddCar. Show current fuel prices.

### Step 11 — utils/fuelPrices.ts

Fetch fuel prices from GlobePetrolPrices API. Cache in chrome.storage.local with timestamp. Refresh if stale (>24h). Return cached prices if fetch fails.

### Step 12 — background/index.ts

Service worker. On install: fetch fuel prices. On daily alarm: refresh fuel prices. Respond to messages from content script requesting current prices.

### Step 13 — utils/calculator.ts

Pure functions only — no DOM, no API calls, easy to unit test:

- `calcFuelUsed(distanceKm, profile): number`
- `calcCost(fuelUsed, prices, fuelType): number`
- `convertDistance(value, from, to): number`
- `formatCost(amount, currency): string`

### Step 14 — Settings.tsx

Wire all settings controls to storage. Implement toggle disable logic for showAverageComparison when Average Car is active.

### Step 15 — content/index.ts + injected.css

MutationObserver watching for Google Maps distance text. Parse distance. Fetch profile + prices from storage. Run calculator. Create Shadow DOM host, inject isolated styles from injected.css, render fuel cost element. Handle route changes. Support all regional Google Maps domains.

This is the most brittle step. Build last when everything else is confirmed working.

---

## Regional Google Maps Domain Support

Google Maps uses different domains by region. The content script must match all of them:

- google.com/maps
- maps.google.com
- maps.google.com.au
- maps.google.co.uk
- maps.google.ca
- maps.google.co.nz
- (and many more)

In manifest.json, use a broad match pattern:

```json
"matches": ["https://*.google.*/maps/*", "https://maps.google.*/*"]
```

---

## Notes for Coding Agent

- Create the LICENSE file first — it should be at the repo root before any code is written
- Start with manifest.json and confirm the extension loads before writing any feature code
- Use `chrome.storage.sync` for user data (roams across devices), `chrome.storage.local` for fuel price cache only
- The AVERAGE_CAR_ID should be a hardcoded constant e.g. `"__average__"` — never a uuid
- Average Car profile must always be at index 0 of the cars array and must survive any storage migration
- Content script should never crash the page — wrap all logic in try/catch
- MutationObserver should disconnect and reconnect cleanly — memory leaks here will affect Maps performance
- Fuel prices should always show their source and last updated time so users can trust them
- All calculation functions in calculator.ts should be pure and exported for easy testing
- The popup is a fixed-size Chrome extension popup (~380px wide) — design accordingly, no scrolling on home view
- SolidJS signals are the source of truth for popup view state; chrome.storage is the source of truth for persistent data
- All popup component styles must use Vanilla Extract `.css.ts` files — never inline styles or plain CSS files in the popup
- All design tokens (colours, spacing, fonts) must go through `theme.css.ts` vars — never hardcode values in component style files
- `vanillaExtractPlugin()` must be listed before `solidPlugin()` in vite.config.ts plugins array
- The content script cannot use Vanilla Extract — use `injected.css` (plain CSS) loaded into a Shadow DOM instead
- Shadow DOM mode should be `closed` to prevent Google Maps JS from accessing the shadow root
- Never apply styles directly to Google Maps DOM elements — always inject a self-contained host element with its own Shadow DOM
