interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md'
  color?: 'indigo' | 'gold' | 'green'
  className?: string
}

const colors = {
  indigo: 'from-indigo-600 to-indigo-400',
  gold: 'from-amber-500 to-yellow-400',
  green: 'from-emerald-600 to-emerald-400',
}

export function ProgressBar({ value, max = 100, label, showPercent = false, size = 'md', color = 'indigo', className = '' }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>}
          {showPercent && <span className="text-xs font-semibold text-gray-900 dark:text-white">{pct}%</span>}
        </div>
      )}
      <div className={`bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
