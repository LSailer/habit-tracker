import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AppStore, MonthKey, DateKey, Habit } from '../models/types'
import {
  loadStore,
  saveStore,
  getOrCreateMonth,
  checkHabit as checkHabitPure,
  addHabit as addHabitPure,
  updateHabit as updateHabitPure,
  deleteHabit as deleteHabitPure,
} from '../logic/storage'

interface StoreContextValue {
  store: AppStore
  ensureMonth: (key: MonthKey) => void
  toggleHabit: (monthKey: MonthKey, dateKey: DateKey, habitId: string, checked: boolean) => void
  addHabit: (monthKey: MonthKey, habit: Omit<Habit, 'id'>) => void
  updateHabit: (monthKey: MonthKey, habitId: string, name: string) => void
  deleteHabit: (monthKey: MonthKey, habitId: string) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export { StoreContext }

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function useStoreProvider() {
  const [store, setStore] = useState<AppStore>(() => loadStore())

  useEffect(() => {
    saveStore(store)
  }, [store])

  const ensureMonth = useCallback((key: MonthKey) => {
    setStore((s) => getOrCreateMonth(s, key))
  }, [])

  const toggleHabit = useCallback(
    (monthKey: MonthKey, dateKey: DateKey, habitId: string, checked: boolean) => {
      setStore((s) => {
        const next = checkHabitPure(s, monthKey, dateKey, habitId, checked)
        return next
      })
    },
    [],
  )

  const addHabit = useCallback((monthKey: MonthKey, habit: Omit<Habit, 'id'>) => {
    setStore((s) => addHabitPure(s, monthKey, habit))
  }, [])

  const updateHabit = useCallback((monthKey: MonthKey, habitId: string, name: string) => {
    setStore((s) => updateHabitPure(s, monthKey, habitId, name))
  }, [])

  const deleteHabit = useCallback((monthKey: MonthKey, habitId: string) => {
    setStore((s) => deleteHabitPure(s, monthKey, habitId))
  }, [])

  return { store, ensureMonth, toggleHabit, addHabit, updateHabit, deleteHabit }
}
