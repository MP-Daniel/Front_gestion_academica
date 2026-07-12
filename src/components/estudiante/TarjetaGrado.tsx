import { GraduationCap } from 'lucide-react'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import type { EstadoMatricula } from '@/types/matricula.types'

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

interface TarjetaGradoProps {
  gradoNombre: string
  estadoMatricula: EstadoMatricula | null
  jornada: string | null
}

export function TarjetaGrado({ gradoNombre, estadoMatricula, jornada }: TarjetaGradoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tu Grado</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <GraduationCap size={18} />
        </div>
      </div>

      <p className="mt-2 text-3xl font-bold text-slate-900">{gradoNombre}</p>
      {estadoMatricula && (
        <div className="mt-1">
          <Badge color={COLOR_ESTADO[estadoMatricula]}>Matrícula {estadoMatricula}</Badge>
        </div>
      )}
      {jornada && <p className="text-sm text-slate-400">Jornada {jornada}</p>}

      <div className="relative mt-5 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-brand-600 via-accent-400 to-blue-900">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
          Símbolo institucional
        </span>
      </div>
    </div>
  )
}
