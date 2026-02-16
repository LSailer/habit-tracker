import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '../hooks/useStore'
import {
  currentMonthKey,
  elapsedDaysInMonth,
  getMonthStatus,
  isLastDayOfMonth,
  formatMonthLabel,
} from '../logic/dateUtils'
import type { MonthKey, HabitStat } from '../models/types'
import MonthSelector from '../components/MonthSelector'
import { useState } from 'react'

const TYPE_COLORS: Record<string, string> = {
  good: '#22c55e',
  project: '#3b82f6',
  bad: '#ef4444',
}

function computeStats(
  store: ReturnType<typeof useStore>['store'],
  key: MonthKey,
): HabitStat[] {
  const monthData = store[key]
  if (!monthData) return []
  const elapsed = elapsedDaysInMonth(key)
  const totalDays = elapsed.length
  if (totalDays === 0) return []

  return monthData.habits.map((habit) => {
    const checkedDays = elapsed.filter((d) => monthData.log[d]?.[habit.id]).length
    const percentage = Math.round((checkedDays / totalDays) * 100)
    return { habit, checkedDays, totalDays, percentage }
  })
}

export default function DashboardView() {
  const { store } = useStore()
  const current = currentMonthKey()

  const monthsWithData = useMemo(() => {
    const keys = Object.keys(store).filter(
      (k) => getMonthStatus(k) !== 'future' && store[k].habits.length > 0,
    )
    if (!keys.includes(current)) keys.push(current)
    return keys.sort()
  }, [store, current])

  const options = monthsWithData.length > 0 ? monthsWithData : [current]
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(current)

  const stats = useMemo(() => computeStats(store, selectedMonth), [store, selectedMonth])

  const overallScore =
    stats.length > 0
      ? Math.round(stats.reduce((acc, s) => acc + s.percentage, 0) / stats.length)
      : 0

  const totalCheckins = stats.reduce((acc, s) => acc + s.checkedDays, 0)
  const bestHabit = stats.length > 0 ? [...stats].sort((a, b) => b.percentage - a.percentage)[0] : null
  const worstHabit = stats.length > 0 ? [...stats].sort((a, b) => a.percentage - b.percentage)[0] : null

  const showEndOfMonth =
    isLastDayOfMonth(selectedMonth) && getMonthStatus(selectedMonth) === 'current' && stats.length > 0

  const chartData = stats.map((s) => ({
    name: s.habit.name.length > 14 ? s.habit.name.slice(0, 13) + '…' : s.habit.name,
    value: s.percentage,
    type: s.habit.type,
  }))

  const monthData = store[selectedMonth]
  const hasHabits = monthData && monthData.habits.length > 0

  return (
    <div className="pb-4">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <MonthSelector value={selectedMonth} options={options} onChange={setSelectedMonth} />

      {!hasHabits ? (
        <p className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
          No habits tracked for {formatMonthLabel(selectedMonth)}.
        </p>
      ) : (
        <>
          {/* Summary card */}
          <div className="mx-4 mt-2 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wide">
                  Overall
                </p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-300">
                  {overallScore}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalCheckins} check-ins
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.length} habit{stats.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* End-of-month banner */}
          {showEndOfMonth && bestHabit && worstHabit && (
            <div className="mx-4 mt-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 space-y-1">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                Month wrap-up
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                🏆 Best: <span className="font-semibold">{bestHabit.habit.name}</span>{' '}
                ({bestHabit.percentage}%)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                📉 Needs work: <span className="font-semibold">{worstHabit.habit.name}</span>{' '}
                ({worstHabit.percentage}%)
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                📅 Total tracked: {totalCheckins}
              </p>
            </div>
          )}

          {/* Bar chart */}
          {chartData.length > 0 && (
            <div className="mx-4 mt-4">
              <ResponsiveContainer width="100%" height={Math.max(chartData.length * 44, 120)}>
                <BarChart layout="vertical" data={chartData} margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={TYPE_COLORS[entry.type] ?? '#6b7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Per-habit stats */}
          <div className="mx-4 mt-4 space-y-2">
            {stats.map((s) => (
              <div
                key={s.habit.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: TYPE_COLORS[s.habit.type] }}
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-100">{s.habit.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {s.checkedDays}/{s.totalDays}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
