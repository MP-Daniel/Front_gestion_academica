import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeColor =
  | 'brand'
  | 'accent'
  | 'red'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'orange'
  | 'indigo'
  | 'slate'

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
}

const ESTILOS_COLOR: Record<BadgeColor, string> = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-100 text-accent-600',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  pink: 'bg-pink-100 text-pink-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  orange: 'bg-orange-100 text-orange-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  slate: 'bg-slate-100 text-slate-600',
}

export function Badge({ children, color = 'slate' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        ESTILOS_COLOR[color],
      )}
    >
      {children}
    </span>
  )
}
