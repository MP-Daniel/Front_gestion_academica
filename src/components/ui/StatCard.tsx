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
        'relative overflow-hidden rounded-xl border-l-4 bg-white px-4 py-3 shadow-sm',
        estilos.borde,
      )}
    >
      <div className="relative z-10 flex flex-col justify-start pr-10">
        <p className="whitespace-nowrap text-xs font-medium uppercase text-slate-400">
          {etiqueta}
        </p>
        <p className="mt-1 text-xl font-bold leading-none text-slate-900">{valor}</p>
        {pista && <p className="mt-1 max-w-56 text-xs text-slate-400">{pista}</p>}
      </div>
      <div
        className={cn(
          'pointer-events-none absolute right-3 top-1/2 z-0 flex h-14 w-14 -translate-y-1/2 -rotate-12 items-center justify-center rounded-2xl opacity-10',
          estilos.fondoIcono,
          estilos.textoIcono,
        )}
      >
        <Icono size={48} />
      </div>
    </div>
  )
}
