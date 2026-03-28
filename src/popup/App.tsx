import { createSignal, Match, Switch, type Component } from 'solid-js'
import { themeClass } from './styles/theme.css'
import './styles/global.css'
import type { PopupView } from '@utils/types'
import { Header } from '@components/Header'
import { Home } from '@components/Home'
import { CarSearch } from '@components/CarSearch'
import { Settings } from '@components/Settings'

const App: Component = () => {
  const [view, setView] = createSignal<PopupView>({ kind: 'home' })

  const title = () => {
    const v = view()
    switch (v.kind) {
      case 'home':
        return 'Fuel Cost'
      case 'addCar':
        return 'Add a car'
      case 'editCar':
        return 'Edit car'
      case 'settings':
        return 'Settings'
    }
  }

  const showBack = () => view().kind !== 'home'

  return (
    <div class={themeClass}>
      <Header
        title={title()}
        showBack={showBack()}
        onBack={() => setView({ kind: 'home' })}
        onSettings={() => setView({ kind: 'settings' })}
        showSettings={view().kind === 'home'}
      />
      <Switch>
        <Match when={view().kind === 'home'}>
          <Home
            onAddCar={() => setView({ kind: 'addCar' })}
            onEditCar={(id) => setView({ kind: 'editCar', carId: id })}
            onSettings={() => setView({ kind: 'settings' })}
          />
        </Match>
        <Match when={view().kind === 'addCar' || view().kind === 'editCar'}>
          <CarSearch
            editCarId={
              view().kind === 'editCar'
                ? (view() as { kind: 'editCar'; carId: string }).carId
                : undefined
            }
            onDone={() => setView({ kind: 'home' })}
          />
        </Match>
        <Match when={view().kind === 'settings'}>
          <Settings onBack={() => setView({ kind: 'home' })} />
        </Match>
      </Switch>
    </div>
  )
}

export { App }
