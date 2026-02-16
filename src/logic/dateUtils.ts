import type { MonthKey, DateKey, MonthStatus } from '../models/types'

export function toMonthKey(date: Date): MonthKey {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function toDateKey(date: Date): DateKey {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function currentMonthKey(): MonthKey {
  return toMonthKey(new Date())
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

export function getMonthStatus(key: MonthKey): MonthStatus {
  const current = currentMonthKey()
  if (key === current) return 'current'
  return key > current ? 'future' : 'past'
}

export function daysInMonth(key: MonthKey): number {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function elapsedDaysInMonth(key: MonthKey): DateKey[] {
  const status = getMonthStatus(key)
  const [y, m] = key.split('-').map(Number)
  const today = new Date()
  const lastDay =
    status === 'future'
      ? 0
      : status === 'current'
        ? today.getDate()
        : daysInMonth(key)

  const days: DateKey[] = []
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(y, m - 1, d)
    days.push(toDateKey(date))
  }
  return days
}

export function isLastDayOfMonth(key: MonthKey): boolean {
  const today = new Date()
  if (toMonthKey(today) !== key) return false
  const total = daysInMonth(key)
  return today.getDate() === total
}

export function formatMonthLabel(key: MonthKey): string {
  const [y, m] = key.split('-').map(Number)
  const date = new Date(y, m - 1, 1)
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

export function addMonths(key: MonthKey, n: number): MonthKey {
  const [y, m] = key.split('-').map(Number)
  const date = new Date(y, m - 1 + n, 1)
  return toMonthKey(date)
}
