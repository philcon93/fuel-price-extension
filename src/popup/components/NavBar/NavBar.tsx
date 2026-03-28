import { For, type Component } from 'solid-js'
import * as s from './NavBar.css'
import type { PopupView } from '@utils/types'
import { useI18n } from '@utils/i18n'

type NavTab = {
  kind: PopupView['kind']
  icon: string
  labelKey: string
}

const TABS: NavTab[] = [
  { kind: 'home', icon: 'dashboard', labelKey: 'Dashboard' },
  { kind: 'cars', icon: 'directions_car', labelKey: 'Cars' },
  { kind: 'history', icon: 'history', labelKey: 'History' },
  { kind: 'settings', icon: 'settings', labelKey: 'Settings' },
]

interface NavBarProps {
  activeView: PopupView['kind']
  onNavigate: (kind: PopupView['kind']) => void
}

export const NavBar: Component<NavBarProps> = (props) => {
  const i18n = useI18n()

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
            aria-label={i18n[tab.labelKey]}
          >
            <span class="material-symbols-outlined">{tab.icon}</span>
            <span class={s.tabLabel}>{i18n[tab.labelKey]}</span>
          </button>
        )}
      </For>
    </nav>
  )
}
