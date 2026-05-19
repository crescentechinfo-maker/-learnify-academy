import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  return (
    <div
      className={`
        glass rounded-xl p-6
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${gradient ? 'border border-indigo-500/20 shadow-lg shadow-indigo-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: string
  color?: 'indigo' | 'gold' | 'green' | 'red'
}

const colorMap = {
  indigo: 'from-indigo-600 to-indigo-400',
  gold: 'from-amber-500 to-yellow-400',
  green: 'from-emerald-600 to-emerald-400',
  red: 'from-red-600 to-red-400',
}

export function StatCard({ title, value, icon, change, color = 'indigo' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white shadow-lg flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {change && <p className="text-xs text-emerald-500 mt-0.5">{change}</p>}
      </div>
    </Card>
  )
}
