import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthLabel } from '../logic/dateUtils'
import type { MonthKey } from '../models/types'

interface Props {
  value: MonthKey
  options: MonthKey[]
  onChange: (key: MonthKey) => void
}

export default function MonthSelector({ value, options, onChange }: Props) {
  const idx = options.indexOf(value)

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={() => idx > 0 && onChange(options[idx - 1])}
        disabled={idx <= 0}
        className="p-1 rounded-full disabled:opacity-30 text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-800"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
        {formatMonthLabel(value)}
      </span>
      <button
        onClick={() => idx < options.length - 1 && onChange(options[idx + 1])}
        disabled={idx >= options.length - 1}
        className="p-1 rounded-full disabled:opacity-30 text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-800"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
