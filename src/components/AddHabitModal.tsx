import { useState } from 'react'
import { X } from 'lucide-react'
import type { HabitType } from '../models/types'

interface Props {
  onAdd: (name: string, type: HabitType) => void
  onClose: () => void
}

const TYPE_OPTIONS: { type: HabitType; label: string; color: string }[] = [
  { type: 'good', label: 'Good', color: 'bg-green-500 text-white' },
  { type: 'project', label: 'Project', color: 'bg-blue-500 text-white' },
  { type: 'bad', label: 'Bad', color: 'bg-red-500 text-white' },
]

export default function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState<HabitType>('good')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, type)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-[420px] bg-white dark:bg-gray-900 rounded-t-2xl p-6 pb-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Habit</h2>
          <button onClick={onClose} className="p-1 text-gray-400 dark:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            type="text"
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2">
            {TYPE_OPTIONS.map(({ type: t, label, color }) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${color} ${
                  type === t ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-current scale-105' : 'opacity-60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold disabled:opacity-40 active:scale-95 transition-transform"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  )
}
