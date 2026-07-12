import { Badge, type BadgeColor } from '@/components/ui/Badge'
import type { ResumenAnioLectivoCalificaciones } from '@/types/calificaciones.types'
import type { EstadoMatricula } from '@/types/matricula.types'

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

interface BandaAnioLectivoProps {
  anioLectivo: ResumenAnioLectivoCalificaciones
}

export function BandaAnioLectivo({ anioLectivo }: BandaAnioLectivoProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-accent-300 to-accent-500" />
        <div>
          <p className="text-lg font-bold text-slate-900">
            Año Lectivo {anioLectivo.anio ?? '—'}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {anioLectivo.gradoNombre}
            </span>
            {anioLectivo.estadoMatricula && (
              <Badge color={COLOR_ESTADO[anioLectivo.estadoMatricula]}>
                Matrícula {anioLectivo.estadoMatricula}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Director de Grupo</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{anioLectivo.directorGrupo ?? 'Sin asignar'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Periodo Actual</p>
          <p className="mt-1 text-sm font-bold text-brand-700">{anioLectivo.periodoActual ?? 'Sin definir'}</p>
        </div>
      </div>
    </div>
  )
}
