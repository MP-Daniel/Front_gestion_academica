import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TarjetaResumenProps {
  valor: number | string
  etiqueta: string
  descripcion: string
  icono: LucideIcon
  color: 'brand' | 'accent'
}

const ESTILOS_COLOR = {
  brand: { fondo: 'bg-brand-50', icono: 'bg-brand-600 text-white' },
  accent: { fondo: 'bg-accent-100', icono: 'bg-accent-500 text-white' },
} as const

export function TarjetaResumen({ valor, etiqueta, descripcion, icono: Icono, color }: TarjetaResumenProps) {
  const estilos = ESTILOS_COLOR[color]

  return (
    <div className={cn('flex items-center gap-4 rounded-xl p-6', estilos.fondo)}>
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full', estilos.icono)}>
        <Icono size={22} />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-900">
          {valor} {etiqueta}
        </p>
        <p className="text-sm text-slate-500">{descripcion}</p>
      </div>
    </div>
  )
}
