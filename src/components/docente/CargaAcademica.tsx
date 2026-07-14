import { BookOpen, Clock, Users } from 'lucide-react'

export interface ClaseHoy {
  id: number
  hora: string
  asignatura: string
  grado: string
  cantidadEstudiantes: number
}

interface CargaAcademicaProps {
  clases: ClaseHoy[]
}

export function CargaAcademica({ clases }: CargaAcademicaProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Carga Académica de Hoy</h3>
        <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {clases.length} {clases.length === 1 ? 'clase' : 'clases'}
        </span>
      </div>

      {clases.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No tienes clases programadas para hoy.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {clases.map((clase) => (
            <div
              key={clase.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <BookOpen size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{clase.asignatura}</p>
                <p className="text-xs text-slate-500">{clase.grado}</p>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock size={14} />
                {clase.hora}
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                <Users size={14} />
                {clase.cantidadEstudiantes}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
