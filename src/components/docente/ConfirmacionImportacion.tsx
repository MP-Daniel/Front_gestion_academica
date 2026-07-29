import { FileCheck2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ResultadoPreviewImportacion } from '@/types/nota.types'

interface ConfirmacionImportacionProps {
  previsualizacion: ResultadoPreviewImportacion
  confirmando: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ConfirmacionImportacion({
  previsualizacion,
  confirmando,
  onConfirmar,
  onCancelar,
}: ConfirmacionImportacionProps) {
  const { filas, totalCreaciones, totalActualizaciones } = previsualizacion

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <FileCheck2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Confirmar importación</h2>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{totalCreaciones}</span> nota(s) nueva(s) y{' '}
              <span className="font-semibold text-slate-700">{totalActualizaciones}</span> actualización(es).
            </p>
          </div>
        </div>

        <div className="overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3">Estudiante</th>
                <th className="px-6 py-3 text-center">Nota actual</th>
                <th className="px-6 py-3 text-center">Nota nueva</th>
                <th className="px-6 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filas.map((fila) => (
                <tr key={fila.documento}>
                  <td className="px-6 py-3">
                    <p className="font-medium text-slate-900">{fila.nombreEstudiante}</p>
                    <p className="text-xs text-slate-400">{fila.documento}</p>
                  </td>
                  <td className="px-6 py-3 text-center text-slate-500">
                    {fila.notaActual !== null ? fila.notaActual.toFixed(1) : '—'}
                  </td>
                  <td className="px-6 py-3 text-center font-semibold text-slate-900">
                    {fila.notaNueva.toFixed(1)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Badge color={fila.actualizacion ? 'accent' : 'brand'}>
                      {fila.actualizacion ? 'Actualizar' : 'Nueva'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <div>
            <Button type="button" variant="secondary" onClick={onCancelar} disabled={confirmando}>
              Cancelar
            </Button>
          </div>
          <div>
            <Button type="button" isLoading={confirmando} onClick={onConfirmar}>
              Confirmar e Importar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
