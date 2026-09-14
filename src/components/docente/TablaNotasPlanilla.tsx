import { cn, estiloNotaFinal } from '@/lib/utils'
import type { Nota } from '@/types/nota.types'

interface TablaNotasPlanillaProps {
  notas: Nota[]
}

export function TablaNotasPlanilla({ notas }: TablaNotasPlanillaProps) {
  if (notas.length === 0) {
    return null
  }

  const calificados = notas.filter((n) => n.valor !== null && n.valor !== undefined).length

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Planilla de estudiantes del curso</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            {calificados} de {notas.length} estudiantes con nota registrada
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              <th className="px-6 py-3">Documento</th>
              <th className="px-6 py-3">Estudiante</th>
              <th className="px-6 py-3 text-center">Nota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notas.map((nota) => (
              <tr key={nota.id ?? `matricula-${nota.matriculaId}`}>
                <td className="px-6 py-3 text-sm text-slate-600">{nota.documentoEstudiante}</td>
                <td className="px-6 py-3 text-sm font-medium text-slate-900">{nota.nombreEstudiante}</td>
                <td className="px-6 py-3 text-center">
                  {nota.valor !== null && nota.valor !== undefined ? (
                    <span
                      className={cn(
                        'inline-flex min-w-14 items-center justify-center rounded-lg border px-3 py-1 text-sm font-bold',
                        estiloNotaFinal(nota.valor),
                      )}
                    >
                      {nota.valor.toFixed(1)}
                    </span>
                  ) : (
                    <span className="inline-flex min-w-14 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400">
                      Sin calificar
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
