import { useState, useRef, useCallback } from 'react'
import { Lock, Plus, Trash2, GripVertical } from 'lucide-react'
import { useStore } from '../hooks/useStore'
import {
  currentMonthKey,
  getMonthStatus,
  addMonths,
} from '../logic/dateUtils'
import type { MonthKey, HabitType } from '../models/types'
import MonthSelector from '../components/MonthSelector'
import AddHabitModal from '../components/AddHabitModal'

const TYPE_DOT: Record<HabitType, string> = {
  good: 'bg-green-500',
  project: 'bg-blue-500',
  bad: 'bg-red-500',
}

export default function ConfigView() {
  const { store, ensureMonth, addHabit, updateHabit, deleteHabit } = useStore()
  const current = currentMonthKey()

  // only future months (current+1 to current+3) are editable
  const futureOptions: MonthKey[] = [1, 2, 3].map((n) => addMonths(current, n))
  const allOptions: MonthKey[] = [current, ...futureOptions]

  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(current)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [swipedId, setSwipedId] = useState<string | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const status = getMonthStatus(selectedMonth)
  const locked = status !== 'future'

  function handleMonthChange(key: MonthKey) {
    setSelectedMonth(key)
    if (getMonthStatus(key) === 'future') {
      ensureMonth(key)
    }
    setSwipedId(null)
    setEditingId(null)
  }

  const monthData = store[selectedMonth]
  const habits = monthData?.habits ?? []

  function startEdit(id: string, name: string) {
    if (locked) return
    setEditingId(id)
    setEditValue(name)
    setSwipedId(null)
  }

  function commitEdit(id: string) {
    if (editValue.trim()) updateHabit(selectedMonth, id, editValue.trim())
    setEditingId(null)
  }

  function handleLongPress(id: string) {
    if (locked) return
    setSwipedId((prev) => (prev === id ? null : id))
  }

  function startLongPress(id: string) {
    longPressTimer.current = setTimeout(() => handleLongPress(id), 500)
  }

  function cancelLongPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const handleAdd = useCallback(
    (name: string, type: HabitType) => {
      ensureMonth(selectedMonth)
      addHabit(selectedMonth, { name, type })
    },
    [selectedMonth, ensureMonth, addHabit],
  )

  return (
    <div className="pb-4">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Config</h1>
      </div>

      <MonthSelector value={selectedMonth} options={allOptions} onChange={handleMonthChange} />

      {locked && (
        <div className="mx-4 mb-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
          <Lock size={16} />
          {status === 'current' ? 'Current month is locked' : 'Past months are locked'}
        </div>
      )}

      {habits.length === 0 ? (
        <p className="px-4 py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
          {locked ? 'No habits configured.' : 'No habits yet — tap + to add.'}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center gap-3 px-4 py-3 overflow-hidden"
              onTouchStart={() => startLongPress(habit.id)}
              onTouchEnd={cancelLongPress}
              onMouseDown={() => startLongPress(habit.id)}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
            >
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${TYPE_DOT[habit.type]}`} />
              {editingId === habit.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitEdit(habit.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit(habit.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="flex-1 bg-transparent text-gray-900 dark:text-white border-b border-blue-400 focus:outline-none"
                />
              ) : (
                <span
                  className="flex-1 text-gray-800 dark:text-gray-100"
                  onClick={() => startEdit(habit.id, habit.name)}
                >
                  {habit.name}
                </span>
              )}
              {!locked && swipedId === habit.id && (
                <button
                  onClick={() => {
                    deleteHabit(selectedMonth, habit.id)
                    setSwipedId(null)
                  }}
                  className="flex-shrink-0 p-2 rounded-lg bg-red-500 text-white active:scale-95 transition-transform"
                >
                  <Trash2 size={18} />
                </button>
              )}
              {!locked && swipedId !== habit.id && (
                <GripVertical size={18} className="flex-shrink-0 text-gray-300 dark:text-gray-600" />
              )}
            </li>
          ))}
        </ul>
      )}

      {!locked && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40 flex items-center justify-center text-white active:scale-90 transition-transform"
          aria-label="Add habit"
        >
          <Plus size={28} />
        </button>
      )}

      {showModal && <AddHabitModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </div>
  )
}
