export type HabitType = 'good' | 'project' | 'bad'
export type MonthKey = string  // "YYYY-MM"
export type DateKey = string   // "YYYY-MM-DD"

export interface Habit {
  id: string
  name: string
  type: HabitType
}

export interface MonthData {
  habits: Habit[]
  log: Record<DateKey, Record<string, true>>
}

export type AppStore = Record<MonthKey, MonthData>

export interface HabitStat {
  habit: Habit
  checkedDays: number
  totalDays: number
  percentage: number
}

export interface MonthSummary {
  stats: HabitStat[]
  overallScore: number
  bestHabit: HabitStat | null
  worstHabit: HabitStat | null
}

export type MonthStatus = 'future' | 'current' | 'past'
