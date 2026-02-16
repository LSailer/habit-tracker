import { CheckSquare, Settings, BarChart2 } from 'lucide-react'

type View = 'today' | 'config' | 'dashboard'

interface Props {
  current: View
  onChange: (v: View) => void
}

const tabs: { id: View; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'today', label: 'Today', Icon: CheckSquare },
  { id: 'config', label: 'Config', Icon: Settings },
  { id: 'dashboard', label: 'Stats', Icon: BarChart2 },
]

export default function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pb-safe">
      {tabs.map(({ id, label, Icon }) => {
        const active = current === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 py-3 px-6 text-xs font-medium transition-colors ${
              active
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Icon size={22} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
