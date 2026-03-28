import { For, type Component } from 'solid-js'
import * as s from './NavBar.css'
import type { PopupView } from '@utils/types'

type NavTab = {
  kind: PopupView['kind']
  icon: string
  label: string
}

const TABS: NavTab[] = [
  { kind: 'home', icon: 'dashboard', label: 'Dashboard' },
  { kind: 'cars', icon: 'directions_car', label: 'Cars' },
  { kind: 'history', icon: 'history', label: 'History' },
  { kind: 'settings', icon: 'settings', label: 'Settings' },
]

interface NavBarProps {
  activeView: PopupView['kind']
  onNavigate: (kind: PopupView['kind']) => void
}

export const NavBar: Component<NavBarProps> = (props) => {
  const resolvedActive = (): PopupView['kind'] => {
    const v = props.activeView
    if (v === 'addCar' || v === 'editCar') return 'cars'
    return v
  }

  return (
    <nav class={s.nav}>
      <For each={TABS}>
        {(tab) => (
          <button
            class={`${s.tab} ${resolvedActive() === tab.kind ? s.tabActive : ''}`}
            onClick={() => props.onNavigate(tab.kind)}
            aria-label={tab.label}
          >
            <span class="material-symbols-outlined">{tab.icon}</span>
            <span class={s.tabLabel}>{tab.label}</span>
          </button>
        )}
      </For>
    </nav>
  )
}
