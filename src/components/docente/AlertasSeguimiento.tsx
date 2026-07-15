import { AlertOctagon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { EstudianteBajoRendimiento } from '@/types/dashboardDocente.types'

interface AlertasSeguimientoProps {
  estudiantes: EstudianteBajoRendimiento[]
}

export function AlertasSeguimiento({ estudiantes }: AlertasSeguimientoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <AlertOctagon size={18} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Alertas de Seguimiento</h3>
      </div>

      {estudiantes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No hay estudiantes en seguimiento por ahora.</p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-slate-100">
          {estudiantes.map((estudiante) => (
            <li
              key={`${estudiante.estudianteId}-${estudiante.nombreAsignatura}`}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar nombre={estudiante.nombreCompleto} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{estudiante.nombreCompleto}</p>
                <p className="truncate text-xs text-slate-500">
                  {estudiante.gradoNombre} · {estudiante.nombreAsignatura}
                </p>
              </div>
              <Badge color="orange">Bajo Rendimiento · {estudiante.promedio.toFixed(1)}</Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 w-full">
        <Button type="button" variant="secondary">
          Ver reporte completo
        </Button>
      </div>
    </div>
  )
}
