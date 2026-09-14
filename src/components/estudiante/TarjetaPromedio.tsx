import { TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { BadgeColor } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { NivelPromedio } from '@/types/dashboardEstudiante.types'

interface TarjetaPromedioProps {
  valor?: number | null
  nivel?: NivelPromedio | null
  variacionPeriodoAnterior?: number | null
  historicoPeriodos?: number[] | null
}

const COLOR_POR_NIVEL: Record<NivelPromedio, BadgeColor> = {
  BAJO: 'red',
  BASICO: 'orange',
  ALTO: 'blue',
  SUPERIOR: 'brand',
}

export function TarjetaPromedio({
  valor = 0,
  nivel = 'BAJO',
  variacionPeriodoAnterior = 0,
  historicoPeriodos = [],
}: TarjetaPromedioProps) {
  const valorNum = valor ?? 0
  const nivelSeguro: NivelPromedio = nivel ?? 'BAJO'
  const variacionNum = variacionPeriodoAnterior ?? 0
  const historico = historicoPeriodos ?? []
  const mejorando = variacionNum >= 0
  const maximo = Math.max(...historico, 1)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Promedio General</p>
        {mejorando ? (
          <TrendingUp size={20} className="text-brand-600" />
        ) : (
          <TrendingDown size={20} className="text-red-500" />
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <p className="text-3xl font-bold text-slate-900">{valorNum.toFixed(1)}</p>
        <Badge color={COLOR_POR_NIVEL[nivelSeguro]}>{nivelSeguro}</Badge>
      </div>

      <div className="mt-5 flex h-24 items-end gap-2">
        {historico.map((punto, indice) => (
          <div
            key={indice}
            className={cn(
              'flex-1 rounded-t-sm',
              indice === historico.length - 1 ? 'bg-brand-600' : 'bg-brand-100',
            )}
            style={{ height: `${Math.max((punto / maximo) * 100, 8)}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {mejorando ? '+' : ''}
        {variacionNum.toFixed(1)} respecto al periodo anterior
      </p>
    </div>
  )
}
