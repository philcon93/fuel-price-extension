# Fuel Cost for Google Maps

A Chrome extension that shows how much your journey will cost in fuel, right inside Google Maps. No tab switching, no manual calculations. Pick your car, see the cost.

## What it does

When you plan a route on Google Maps, this extension reads the distance and calculates the fuel cost based on your car's efficiency and current fuel prices. The cost appears inline, next to the distance Google Maps already shows.

**Key features:**

- **Car lookup by name** — type "Corolla 2023 hybrid" and the extension finds the engine specs for you
- **Global coverage** — currency and fuel prices auto-detected for your region
- **Multiple car profiles** — save up to 2 cars (free tier) and switch between them
- **Average car comparison** — see how your car stacks up against the fleet average
- **No manual fuel price entry** — per-country averages built in, refreshed daily

## For end users

### Install

1. Download or clone this repo
2. Run `pnpm install && pnpm build`
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer Mode** (top right)
5. Click **Load Unpacked** and select the `dist/` folder

The extension icon appears in your toolbar. Click it to set up your car, then navigate to Google Maps and plan a route — the fuel cost appears automatically.

### First run

The extension works immediately with an "Average Car" profile based on your region's fleet average. To get accurate costs, click the extension icon and add your own car:

1. Click **+ Add a car**
2. Type your car's name (e.g. "Ford Ranger 2022 diesel")
3. Pick the matching trim from the results
4. Your car is now active — fuel costs on Google Maps will use its efficiency

You can also enter specs manually if your car isn't in the database.

### Settings

- **Distance units** — km or miles
- **Fuel efficiency units** — L/100km, MPG, or kWh/100km
- **Currency** — AUD, USD, GBP, EUR, NZD, CAD, INR, JPY
- **Show average comparison** — display the average car cost alongside your car's cost
- **Fuel prices** — auto-detected per region, manually overridable

## For developers

### Prerequisites

- [Node.js 24+](https://nodejs.org/) (use [nvm](https://github.com/nvm-sh/nvm) — `.nvmrc` included)
- [pnpm](https://pnpm.io/)

### Setup

```bash
nvm use
pnpm install
```

### Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start Vite dev server with HMR      |
| `pnpm build`        | Production build to `dist/`         |
| `pnpm test`         | Run unit tests (vitest)             |
| `pnpm test:watch`   | Run tests in watch mode             |
| `pnpm typecheck`    | TypeScript type checking            |
| `pnpm lint`         | ESLint (TypeScript + SolidJS rules) |
| `pnpm lint:fix`     | ESLint with auto-fix                |
| `pnpm format`       | Format all files with Prettier      |
| `pnpm format:check` | Check formatting without writing    |

### Loading in Chrome

1. Run `pnpm build` (or `pnpm dev` for HMR on the popup)
2. Go to `chrome://extensions`, enable Developer Mode
3. Click **Load Unpacked** and select the `dist/` folder
4. For content/background script changes, click the refresh icon on the extension card

### Tech stack

| Layer              | Technology                                                        |
| ------------------ | ----------------------------------------------------------------- |
| Build              | Vite + @crxjs/vite-plugin                                         |
| UI framework       | SolidJS                                                           |
| Styling            | Vanilla Extract (popup), plain CSS in Shadow DOM (content script) |
| Language           | TypeScript                                                        |
| Extension standard | Chrome Manifest V3                                                |
| Testing            | Vitest                                                            |
| Linting            | ESLint with typescript-eslint + eslint-plugin-solid               |
| Formatting         | Prettier                                                          |

### Project structure

```
src/
  popup/              # Extension popup UI (SolidJS)
    components/       # Each component in its own directory
      Header/
      Home/
      CarSearch/
      TrimPicker/
      ManualEntry/
      Settings/
    styles/           # Vanilla Extract theme and global styles
  content/            # Content script injected into Google Maps
  background/         # Service worker for alarms and message passing
  utils/              # Shared utilities
    calculator.ts     # Pure fuel cost calculation functions
    carLookup.ts      # CarQuery API integration
    fuelPrices.ts     # Per-country fuel price data and caching
    storage.ts        # chrome.storage helpers
    types.ts          # Shared TypeScript interfaces
    __tests__/        # Unit tests
```

## License

PolyForm Noncommercial License 1.0.0 — free for personal and noncommercial use. See [LICENSE](LICENSE) for details.
