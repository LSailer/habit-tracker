import { useState } from 'react'
import { useStore } from '../hooks/useStore'
import { useHaptic } from '../hooks/useHaptic'
import { currentMonthKey, todayKey } from '../logic/dateUtils'
import type { Habit, HabitType } from '../models/types'
import HabitRow from '../components/HabitRow'

const TYPE_ORDER: HabitType[] = ['good', 'project', 'bad']
const TYPE_LABELS: Record<HabitType, string> = {
  good: 'Good Habits',
  project: 'Projects',
  bad: 'Avoid',
}

const MOTIVATIONAL = [
  'All done for today!',
  'Amazing — keep the streak alive!',
  'You crushed it today!',
  "Perfect day — you're on fire!",
]

export default function TodayView({ onGoConfig }: { onGoConfig: () => void }) {
  const { store, ensureMonth, toggleHabit } = useStore()
  const vibrate = useHaptic()
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set())

  const monthKey = currentMonthKey()
  const dateKey = todayKey()

  // ensure current month exists
  const monthData = store[monthKey]

  if (!monthData || monthData.habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center pt-16">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No habits configured yet.</p>
        <button
          onClick={() => { ensureMonth(monthKey); onGoConfig() }}
          className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold active:scale-95 transition-transform"
        >
          Set up habits
        </button>
      </div>
    )
  }

  const dayLog = monthData.log[dateKey] ?? {}
  const allChecked = monthData.habits.every((h) => dayLog[h.id])

  const unchecked = monthData.habits.filter((h) => !dayLog[h.id])
  const checked = monthData.habits.filter((h) => dayLog[h.id])

  function handleCheck(habit: Habit) {
    vibrate()
    setAnimatingIds((prev) => new Set([...prev, habit.id]))
    setTimeout(() => {
      toggleHabit(monthKey, dateKey, habit.id, true)
      setAnimatingIds((prev) => {
        const next = new Set(prev)
        next.delete(habit.id)
        return next
      })
    }, 280)
  }

  function handleUncheck(habit: Habit) {
    toggleHabit(monthKey, dateKey, habit.id, false)
  }

  const grouped = TYPE_ORDER.reduce<Record<HabitType, Habit[]>>(
    (acc, t) => {
      acc[t] = unchecked.filter((h) => h.type === t)
      return acc
    },
    { good: [], project: [], bad: [] },
  )

  const motivational = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]

  return (
    <div className="pb-4">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {allChecked ? (
        <div className="mx-4 mt-6 p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-green-700 dark:text-green-400 font-semibold">{motivational}</p>
        </div>
      ) : (
        <>
          {TYPE_ORDER.map((type) => {
            const habits = grouped[type]
            if (habits.length === 0) return null
            return (
              <div key={type} className="mt-4">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                  {TYPE_LABELS[type]}
                </p>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {habits.map((habit) => (
                    <HabitRow
                      key={habit.id}
                      habit={habit}
                      checked={false}
                      animating={animatingIds.has(habit.id)}
                      onToggle={() => handleCheck(habit)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}

      {checked.length > 0 && !allChecked && (
        <div className="mt-6">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
            Done
          </p>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {checked.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                checked={true}
                onToggle={() => handleUncheck(habit)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
