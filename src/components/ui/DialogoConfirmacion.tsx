import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface DialogoConfirmacionProps {
  abierto: boolean
  titulo: string
  mensaje: string
  error?: string
  procesando?: boolean
  textoConfirmar?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  error,
  procesando = false,
  textoConfirmar = 'Confirmar',
  onConfirmar,
  onCancelar,
}: DialogoConfirmacionProps) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{titulo}</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">{mensaje}</p>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <div>
            <Button type="button" variant="secondary" onClick={onCancelar} disabled={procesando}>
              Cancelar
            </Button>
          </div>
          <div>
            <Button type="button" variant="peligro" isLoading={procesando} onClick={onConfirmar}>
              {textoConfirmar}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
