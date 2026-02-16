import { v4 as uuidv4 } from 'uuid'
import type { AppStore, MonthKey, DateKey, Habit, MonthData } from '../models/types'

const STORE_KEY = 'habit-tracker-v1'
const FIRST_LOAD_KEY = 'habit-tracker-first-load'

export function loadStore(): AppStore {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as AppStore) : {}
  } catch {
    return {}
  }
}

export function saveStore(store: AppStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
}

function emptyMonth(): MonthData {
  return { habits: [], log: {} }
}

/** Returns most recent month key strictly before `key`, or null */
function priorMonthKey(store: AppStore, key: MonthKey): MonthKey | null {
  const keys = Object.keys(store)
    .filter((k) => k < key)
    .sort()
  return keys.length > 0 ? keys[keys.length - 1] : null
}

const DEFAULT_HABITS: Omit<Habit, 'id'>[] = [
  { name: 'Exercise', type: 'good' },
  { name: 'Read 10 pages', type: 'good' },
  { name: 'Stretching 10 min', type: 'good' },
  { name: 'Master Thesis', type: 'project' },
  { name: 'Lecture AGI', type: 'project' },
  { name: 'DIMAG', type: 'project' },
  { name: 'Porno', type: 'bad' },
  { name: 'Alcohol', type: 'bad' },
  { name: 'Scrolling', type: 'bad' },
  { name: "Don't know", type: 'bad' },
]

export function getOrCreateMonth(store: AppStore, key: MonthKey): AppStore {
  if (store[key]) return store

  const prior = priorMonthKey(store, key)
  const copiedHabits: Habit[] = prior
    ? store[prior].habits.map((h) => ({ ...h, id: uuidv4() }))
    : DEFAULT_HABITS.map((h) => ({ ...h, id: uuidv4() }))

  return { ...store, [key]: { habits: copiedHabits, log: {} } }
}

export function checkHabit(
  store: AppStore,
  key: MonthKey,
  dateKey: DateKey,
  habitId: string,
  checked: boolean,
): AppStore {
  const month = store[key] ?? emptyMonth()
  const dayLog = { ...(month.log[dateKey] ?? {}) }
  if (checked) {
    dayLog[habitId] = true
  } else {
    delete dayLog[habitId]
  }
  const newLog = { ...month.log, [dateKey]: dayLog }
  return { ...store, [key]: { ...month, log: newLog } }
}

export function addHabit(store: AppStore, key: MonthKey, habit: Omit<Habit, 'id'>): AppStore {
  const month = store[key] ?? emptyMonth()
  const newHabit: Habit = { ...habit, id: uuidv4() }
  return { ...store, [key]: { ...month, habits: [...month.habits, newHabit] } }
}

export function updateHabit(
  store: AppStore,
  key: MonthKey,
  habitId: string,
  name: string,
): AppStore {
  const month = store[key] ?? emptyMonth()
  const habits = month.habits.map((h) => (h.id === habitId ? { ...h, name } : h))
  return { ...store, [key]: { ...month, habits } }
}

export function deleteHabit(store: AppStore, key: MonthKey, habitId: string): AppStore {
  const month = store[key] ?? emptyMonth()
  const habits = month.habits.filter((h) => h.id !== habitId)
  // remove from log
  const log: MonthData['log'] = {}
  for (const [dateKey, dayLog] of Object.entries(month.log)) {
    const { [habitId]: _removed, ...rest } = dayLog
    void _removed
    log[dateKey] = rest as Record<string, true>
  }
  return { ...store, [key]: { ...month, habits, log } }
}

export function isFirstLoad(): boolean {
  return !localStorage.getItem(FIRST_LOAD_KEY)
}

export function markFirstLoadSeen(): void {
  localStorage.setItem(FIRST_LOAD_KEY, '1')
}
