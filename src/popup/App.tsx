import { createSignal, Match, Switch, type Component } from 'solid-js'
import { themeClass } from './styles/theme.css'
import './styles/global.css'
import type { PopupView } from '@utils/types'
import { NavBar } from '@components/NavBar'
import { Home } from '@components/Home'
import { Cars } from '@components/Cars'
import { CarSearch } from '@components/CarSearch'
import { Settings } from '@components/Settings'
import { TripHistory } from '@components/TripHistory'

export const App: Component = () => {
  const [view, setView] = createSignal<PopupView>({ kind: 'home' })

  const handleNavigate = (kind: PopupView['kind']) => {
    setView({ kind } as PopupView)
  }

  return (
    <div class={themeClass}>
      <NavBar activeView={view().kind} onNavigate={handleNavigate} />
      <Switch>
        <Match when={view().kind === 'home'}>
          <Home />
        </Match>
        <Match when={view().kind === 'cars'}>
          <Cars
            onAddCar={() => setView({ kind: 'addCar' })}
            onEditCar={(id) => setView({ kind: 'editCar', carId: id })}
          />
        </Match>
        <Match when={view().kind === 'addCar' || view().kind === 'editCar'}>
          <CarSearch
            editCarId={
              view().kind === 'editCar'
                ? (view() as { kind: 'editCar'; carId: string }).carId
                : undefined
            }
            onDone={() => setView({ kind: 'cars' })}
          />
        </Match>
        <Match when={view().kind === 'settings'}>
          <Settings onBack={() => setView({ kind: 'home' })} />
        </Match>
        <Match when={view().kind === 'history'}>
          <TripHistory />
        </Match>
      </Switch>
    </div>
  )
}
