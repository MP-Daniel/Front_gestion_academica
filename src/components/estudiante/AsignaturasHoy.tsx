import { useRef } from 'react'
import { BookOpenText, Calculator, ChevronLeft, ChevronRight, FlaskConical, Sprout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn, formatearHora } from '@/lib/utils'
import type { AsignaturaHoy as AsignaturaHoyDto } from '@/types/dashboardEstudiante.types'

const ICONO_POR_PALABRA_CLAVE: Array<{ palabra: string; icono: LucideIcon; color: string }> = [
  { palabra: 'biolog', icono: FlaskConical, color: 'bg-blue-50 text-blue-600' },
  { palabra: 'agropecu', icono: Sprout, color: 'bg-brand-50 text-brand-700' },
  { palabra: 'matem', icono: Calculator, color: 'bg-purple-50 text-purple-600' },
  { palabra: 'espa', icono: BookOpenText, color: 'bg-orange-50 text-orange-600' },
]

function estiloAsignatura(nombre: string) {
  const normalizado = nombre.toLowerCase()
  return (
    ICONO_POR_PALABRA_CLAVE.find(({ palabra }) => normalizado.includes(palabra)) ?? {
      icono: BookOpenText,
      color: 'bg-slate-100 text-slate-600',
    }
  )
}

interface AsignaturasHoyProps {
  asignaturas: AsignaturaHoyDto[]
}

export function AsignaturasHoy({ asignaturas }: AsignaturasHoyProps) {
  const contenedorRef = useRef<HTMLDivElement>(null)

  const desplazar = (direccion: 1 | -1) => {
    contenedorRef.current?.scrollBy({ left: direccion * 220, behavior: 'smooth' })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Asignaturas de Hoy</p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Ver asignaturas anteriores"
            onClick={() => desplazar(-1)}
            className="cursor-pointer rounded-full border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Ver más asignaturas"
            onClick={() => desplazar(1)}
            className="cursor-pointer rounded-full border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {asignaturas.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No tienes asignaturas programadas para hoy.</p>
      ) : (
        <div ref={contenedorRef} className="mt-4 flex gap-4 overflow-x-auto scroll-smooth pb-1">
          {asignaturas.map((asignatura) => {
            const { icono: Icono, color } = estiloAsignatura(asignatura.nombre)
            return (
              <div key={asignatura.id} className="w-40 shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', color)}>
                  <Icono size={20} />
                </div>
                <p className="mt-3 truncate text-sm font-semibold text-slate-900">{asignatura.nombre}</p>
                <p className="text-xs text-slate-400">
                  {formatearHora(asignatura.horaInicio)} - {formatearHora(asignatura.horaFin)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
