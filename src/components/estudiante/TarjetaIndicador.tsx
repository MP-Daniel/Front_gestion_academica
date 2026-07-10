import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { BadgeColor } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface TarjetaIndicadorProps {
  icono: LucideIcon
  colorIcono: string
  valor: string | number
  etiqueta: string
  insignia?: { texto: string; color: BadgeColor }
}

export function TarjetaIndicador({ icono: Icono, colorIcono, valor, etiqueta, insignia }: TarjetaIndicadorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorIcono)}>
          <Icono size={20} />
        </div>
        {insignia && <Badge color={insignia.color}>{insignia.texto}</Badge>}
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">{valor}</p>
      <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">{etiqueta}</p>
    </div>
  )
}
