import type { HabitType } from '../models/types'

const TYPE_COLORS: Record<HabitType, string> = {
  good: 'bg-green-500',
  project: 'bg-blue-500',
  bad: 'bg-red-500',
}

const TYPE_CHECKED: Record<HabitType, string> = {
  good: 'bg-green-500 ring-green-400',
  project: 'bg-blue-500 ring-blue-400',
  bad: 'bg-red-500 ring-red-400',
}

interface Props {
  type: HabitType
  checked: boolean
  animating?: boolean
  onClick?: () => void
}

export default function HabitDot({ type, checked, animating, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-full flex-shrink-0 transition-all duration-200 active:scale-90
        ${checked ? `${TYPE_CHECKED[type]} ring-2 ring-offset-2 dark:ring-offset-gray-900` : `border-2 border-gray-300 dark:border-gray-600 bg-transparent`}
        ${animating ? 'scale-125 opacity-70' : ''}
      `}
      aria-label={checked ? 'Uncheck' : 'Check'}
    >
      {checked && (
        <span className="block w-full h-full rounded-full flex items-center justify-center">
          <svg viewBox="0 0 12 10" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1,5 4,9 11,1" />
          </svg>
        </span>
      )}
      {!checked && (
        <span className={`block w-3 h-3 rounded-full mx-auto ${TYPE_COLORS[type]} opacity-40`} />
      )}
    </button>
  )
}
