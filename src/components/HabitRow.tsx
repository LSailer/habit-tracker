import type { Habit } from '../models/types'
import HabitDot from './HabitDot'

interface Props {
  habit: Habit
  checked: boolean
  animating?: boolean
  onToggle: () => void
}

export default function HabitRow({ habit, checked, animating, onToggle }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-300
        ${animating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}
      `}
    >
      <HabitDot type={habit.type} checked={checked} animating={animating} onClick={onToggle} />
      <span
        className={`text-base font-medium transition-colors ${
          checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'
        }`}
      >
        {habit.name}
      </span>
    </div>
  )
}
