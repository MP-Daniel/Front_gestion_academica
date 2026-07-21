import { Table2 } from 'lucide-react'
import { cn, estiloNotaFinal } from '@/lib/utils'
import type { AsignaturaCalificacion } from '@/types/calificaciones.types'

const BARRAS_COLOR = ['bg-blue-500', 'bg-purple-500', 'bg-brand-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500']

function colorPorNombre(nombre: string) {
  const hash = [...nombre].reduce((acumulado, caracter) => acumulado + caracter.charCodeAt(0), 0)
  return BARRAS_COLOR[hash % BARRAS_COLOR.length]
}

interface RegistroAcademicoProps {
  asignaturas: AsignaturaCalificacion[]
}

export function RegistroAcademico({ asignaturas }: RegistroAcademicoProps) {
  const nombresPeriodos = asignaturas[0]?.notasPorPeriodo.map((p) => p.nombrePeriodo) ?? []

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Table2 size={18} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Registro Académico Oficial</h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> Aprobado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-500" /> Básico
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Bajo
          </span>
        </div>
      </div>

      {asignaturas.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-400">Aún no tienes notas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-6 py-4">Asignatura</th>
                {nombresPeriodos.map((nombre) => (
                  <th key={nombre} className="px-4 py-4 text-center">
                    {nombre}
                  </th>
                ))}
                <th className="px-6 py-4 text-center">Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {asignaturas.map((asignatura) => (
                <tr key={asignatura.cargaAcademicaId} className="align-middle">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className={cn('h-8 w-1 shrink-0 rounded-full', colorPorNombre(asignatura.nombreAsignatura))} />
                      <div>
                        <p className="font-semibold text-slate-900">{asignatura.nombreAsignatura}</p>
                        <p className="text-xs text-slate-400">Docente: {asignatura.nombreDocente}</p>
                      </div>
                    </div>
                  </td>

                  {nombresPeriodos.map((nombrePeriodo) => {
                    const nota = asignatura.notasPorPeriodo.find((p) => p.nombrePeriodo === nombrePeriodo)
                    return (
                      <td key={nombrePeriodo} className="px-4 py-5 text-center text-sm text-slate-600">
                        {nota ? nota.valor.toFixed(1) : '—'}
                      </td>
                    )
                  })}

                  <td className="px-6 py-5 text-center">
                    <span
                      className={cn(
                        'inline-flex min-w-14 items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-bold',
                        estiloNotaFinal(asignatura.notaFinal),
                      )}
                    >
                      {asignatura.notaFinal.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
