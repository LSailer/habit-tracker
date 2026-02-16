import { useState } from 'react'
import { StoreContext, useStoreProvider } from './hooks/useStore'
import { isFirstLoad, markFirstLoadSeen } from './logic/storage'
import { currentMonthKey } from './logic/dateUtils'
import BottomNav from './components/BottomNav'
import WelcomeScreen from './components/WelcomeScreen'
import TodayView from './views/TodayView'
import ConfigView from './views/ConfigView'
import DashboardView from './views/DashboardView'

type View = 'today' | 'config' | 'dashboard'

function AppInner() {
  const [view, setView] = useState<View>('today')
  const [showWelcome, setShowWelcome] = useState(() => isFirstLoad())
  const { store, ensureMonth, ...rest } = useStoreProvider()

  function handleStart() {
    markFirstLoadSeen()
    ensureMonth(currentMonthKey())
    setShowWelcome(false)
    setView('config')
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />
  }

  return (
    <StoreContext.Provider value={{ store, ensureMonth, ...rest }}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 max-w-[420px] mx-auto">
        <main className="flex-1 overflow-y-auto pb-20">
          {view === 'today' && <TodayView onGoConfig={() => setView('config')} />}
          {view === 'config' && <ConfigView />}
          {view === 'dashboard' && <DashboardView />}
        </main>
        <BottomNav current={view} onChange={setView} />
      </div>
    </StoreContext.Provider>
  )
}

export default function App() {
  return <AppInner />
}
