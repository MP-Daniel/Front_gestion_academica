import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ErrorFilaImportacion, ResultadoImportacionNotas } from '@/types/nota.types'

interface ResultadoImportacionProps {
  resultado: ResultadoImportacionNotas | null
  errores: ErrorFilaImportacion[] | null
  mensajeError: string | null
}

export function ResultadoImportacion({ resultado, errores, mensajeError }: ResultadoImportacionProps) {
  if (resultado) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-600" />
        <p className="text-sm text-brand-700">
          <span className="font-semibold">{resultado.notasCreadas}</span> notas creadas y{' '}
          <span className="font-semibold">{resultado.notasActualizadas}</span> actualizadas.
        </p>
      </div>
    )
  }

  if (errores && errores.length > 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm font-semibold text-red-700">
            El archivo tiene {errores.length} {errores.length === 1 ? 'fila' : 'filas'} con errores. No se guardó
            ninguna nota — corrígelas y vuelve a subir el mismo archivo.
          </p>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-red-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-red-100 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <th className="px-4 py-2">Fila</th>
                <th className="px-4 py-2">Documento</th>
                <th className="px-4 py-2">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              {errores.map((error, indice) => (
                <tr key={`${error.fila}-${indice}`}>
                  <td className="px-4 py-2 text-slate-600">{error.fila}</td>
                  <td className="px-4 py-2 text-slate-600">{error.documento || '—'}</td>
                  <td className="px-4 py-2 text-red-600">{error.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (mensajeError) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-600" />
        <p className="text-sm text-red-700">{mensajeError}</p>
      </div>
    )
  }

  return null
}
