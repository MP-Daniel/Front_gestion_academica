import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { CargaAcademica } from '@/types/carga.types'
import type { Periodo } from '@/types/periodo.types'

const CLASE_SELECT =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

interface SelectorPlanillaProps {
  cargas: CargaAcademica[]
  periodos: Periodo[]
  cargaAcademicaId: number | ''
  periodoId: number | ''
  onCambiarCarga: (id: number | '') => void
  onCambiarPeriodo: (id: number | '') => void
  onDescargarPlantilla: () => void
  descargando: boolean
}

export function SelectorPlanilla({
  cargas,
  periodos,
  cargaAcademicaId,
  periodoId,
  onCambiarCarga,
  onCambiarPeriodo,
  onDescargarPlantilla,
  descargando,
}: SelectorPlanillaProps) {
  const puedeDescargar = cargaAcademicaId !== '' && periodoId !== '' && !descargando

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">1. Descargar plantilla</h3>
      <p className="mt-1 text-sm text-slate-500">
        Elige la asignatura/grado y el periodo para generar la plantilla con tus estudiantes.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Asignatura y grado</label>
          <select
            className={CLASE_SELECT}
            value={cargaAcademicaId}
            onChange={(evento) => onCambiarCarga(evento.target.value ? Number(evento.target.value) : '')}
          >
            <option value="">Selecciona...</option>
            {cargas.map((carga) => (
              <option key={carga.id} value={carga.id}>
                {carga.nombreAsignatura} · {carga.nombreGrado}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Periodo</label>
          <select
            className={CLASE_SELECT}
            value={periodoId}
            onChange={(evento) => onCambiarPeriodo(evento.target.value ? Number(evento.target.value) : '')}
          >
            <option value="">Selecciona...</option>
            {periodos.map((periodo) => (
              <option key={periodo.id} value={periodo.id}>
                {periodo.nombre}
                {periodo.cerradoParaDocentes ? ' (cerrado)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 w-fit">
        <Button type="button" variant="secondary" onClick={onDescargarPlantilla} disabled={!puedeDescargar} isLoading={descargando}>
          <Download size={16} />
          Descargar Plantilla
        </Button>
      </div>
    </div>
  )
}
