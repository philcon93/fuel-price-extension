import { Show, type Component } from 'solid-js'
import * as s from './Header.css'

interface HeaderProps {
  title: string
  showBack: boolean
  onBack: () => void
  onSettings: () => void
  showSettings: boolean
}

export const Header: Component<HeaderProps> = (props) => {
  return (
    <header class={s.header}>
      <div class={s.headerLeft}>
        <Show when={props.showBack}>
          <button class={s.backButton} onClick={() => props.onBack()} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </Show>
        <span class={s.title}>{props.title}</span>
      </div>
      <Show when={props.showSettings}>
        <button class={s.settingsButton} onClick={() => props.onSettings()} aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M13.05 10.13C12.95 10.35 12.95 10.61 13.08 10.82L13.42 11.39C13.62 11.72 13.54 12.14 13.24 12.38L12.38 13.05C12.12 13.25 11.76 13.24 11.51 13.02L11.01 12.58C10.83 12.42 10.58 12.36 10.35 12.41L10.12 12.47C9.89 12.53 9.71 12.7 9.65 12.93L9.5 13.51C9.4 13.87 9.07 14.12 8.7 14.12H7.3C6.93 14.12 6.6 13.87 6.5 13.51L6.35 12.93C6.29 12.7 6.11 12.53 5.88 12.47L5.65 12.41C5.42 12.36 5.17 12.42 4.99 12.58L4.49 13.02C4.24 13.24 3.88 13.25 3.62 13.05L2.76 12.38C2.46 12.14 2.38 11.72 2.58 11.39L2.92 10.82C3.05 10.61 3.05 10.35 2.95 10.13L2.85 9.91C2.75 9.69 2.55 9.53 2.31 9.49L1.71 9.38C1.34 9.31 1.07 9 1.04 8.63L0.97 7.23C0.94 6.87 1.18 6.54 1.54 6.45L2.13 6.3C2.36 6.24 2.55 6.07 2.62 5.85C2.69 5.63 2.65 5.39 2.5 5.2L2.12 4.74C1.89 4.45 1.9 4.05 2.15 3.78L3.01 2.84C3.26 2.56 3.66 2.49 3.98 2.66L4.58 2.98C4.79 3.09 5.04 3.08 5.25 2.97L5.46 2.85C5.67 2.73 5.82 2.53 5.86 2.3L5.97 1.7C6.04 1.33 6.35 1.06 6.72 1.03L8.12 0.96C8.48 0.94 8.81 1.18 8.9 1.54L9.05 2.13C9.11 2.36 9.28 2.55 9.5 2.62C9.72 2.69 9.96 2.65 10.15 2.5L10.61 2.12C10.9 1.89 11.3 1.9 11.57 2.15L12.51 3.01C12.79 3.26 12.86 3.66 12.69 3.98L12.37 4.58C12.26 4.79 12.27 5.04 12.38 5.25L12.5 5.46C12.62 5.67 12.82 5.82 13.05 5.86L13.65 5.97C14.02 6.04 14.29 6.35 14.32 6.72L14.39 8.12C14.41 8.48 14.17 8.81 13.81 8.9L13.22 9.05C12.99 9.11 12.8 9.28 12.73 9.5L12.67 9.72C12.62 9.87 12.59 10.01 12.55 10.13H13.05Z"
              stroke="currentColor"
              stroke-width="1.2"
            />
          </svg>
        </button>
      </Show>
    </header>
  )
}
