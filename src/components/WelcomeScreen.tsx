import { Sparkles } from 'lucide-react'

interface Props {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-white dark:bg-gray-950">
      <div className="mb-6 p-4 rounded-full bg-blue-50 dark:bg-blue-900/30">
        <Sparkles size={40} className="text-blue-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Habit Tracker</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xs">
        Track your daily habits, stay consistent, and build the life you want.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-blue-500/30"
      >
        Get Started
      </button>
    </div>
  )
}
