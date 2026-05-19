import type { ReactNode } from 'react'

type BadgeVariant = 'indigo' | 'gold' | 'green' | 'red' | 'gray'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  gold: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
  gray: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  )
}
