import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  etiqueta: string
  valor: number | string
  icono: LucideIcon
  pista?: string
  color?: 'blue' | 'brand' | 'accent'
}

const ESTILOS_COLOR = {
  blue: { borde: 'border-blue-500', fondoIcono: 'bg-blue-50', textoIcono: 'text-blue-600' },
  brand: { borde: 'border-brand-600', fondoIcono: 'bg-brand-50', textoIcono: 'text-brand-700' },
  accent: { borde: 'border-accent-500', fondoIcono: 'bg-accent-100', textoIcono: 'text-accent-600' },
} as const

export function StatCard({ etiqueta, valor, icono: Icono, pista, color = 'blue' }: StatCardProps) {
  const estilos = ESTILOS_COLOR[color]

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border-l-4 bg-white p-6 shadow-sm',
        estilos.borde,
      )}
    >
      <div>
        <p className="text-sm text-slate-500">{etiqueta}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{valor}</p>
        {pista && <p className="mt-1 text-xs text-slate-400">{pista}</p>}
      </div>
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg',
          estilos.fondoIcono,
          estilos.textoIcono,
        )}
      >
        <Icono size={24} />
      </div>
    </div>
  )
}
