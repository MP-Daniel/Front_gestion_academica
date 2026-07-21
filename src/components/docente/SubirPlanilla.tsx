import { FileSpreadsheet, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SubirPlanillaProps {
  archivo: File | null
  onCambiarArchivo: (archivo: File | null) => void
  onSubir: () => void
  puedeSubir: boolean
  subiendo: boolean
}

export function SubirPlanilla({ archivo, onCambiarArchivo, onSubir, puedeSubir, subiendo }: SubirPlanillaProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">2. Subir planilla diligenciada</h3>
      <p className="mt-1 text-sm text-slate-500">Sube el mismo archivo .xlsx una vez tengas las notas registradas.</p>

      <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center hover:border-brand-300 hover:bg-brand-50/40">
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(evento) => onCambiarArchivo(evento.target.files?.[0] ?? null)}
        />
        {archivo ? (
          <>
            <FileSpreadsheet size={28} className="text-brand-600" />
            <span className="text-sm font-semibold text-slate-900">{archivo.name}</span>
            <span className="text-xs text-slate-400">Haz clic para elegir otro archivo</span>
          </>
        ) : (
          <>
            <Upload size={28} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Haz clic para elegir el archivo .xlsx</span>
          </>
        )}
      </label>

      <div className="mt-5 w-fit">
        <Button type="button" onClick={onSubir} disabled={!puedeSubir} isLoading={subiendo}>
          Subir Planilla
        </Button>
      </div>
    </div>
  )
}
