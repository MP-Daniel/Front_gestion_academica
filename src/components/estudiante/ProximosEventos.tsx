import { Calendar } from 'lucide-react'
import type { EventoProximo } from '@/types/dashboardEstudiante.types'

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function formatearFecha(fechaIso: string) {
  const fecha = new Date(fechaIso)
  return { dia: fecha.getDate(), mes: MESES[fecha.getMonth()] }
}

interface ProximosEventosProps {
  eventos: EventoProximo[]
}

export function ProximosEventos({ eventos }: ProximosEventosProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Próximos Eventos</p>
        <Calendar size={18} className="text-slate-300" />
      </div>

      <ul className="mt-4 space-y-4">
        {eventos.length === 0 && <p className="text-sm text-slate-400">No tienes eventos próximos.</p>}
        {eventos.map((evento) => {
          const { dia, mes } = formatearFecha(evento.fecha)
          return (
            <li key={evento.id} className="flex items-start gap-3">
              <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-brand-50 py-1.5 text-brand-700">
                <span className="text-lg leading-none font-bold">{dia}</span>
                <span className="text-[10px] leading-none font-semibold">{mes}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{evento.titulo}</p>
                <p className="truncate text-xs text-slate-500">{evento.descripcion}</p>
                {evento.lugar && (
                  <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                    {evento.lugar}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        className="mt-5 w-full cursor-pointer text-center text-xs font-semibold tracking-wide text-brand-700 uppercase hover:text-brand-800"
      >
        Ver calendario completo
      </button>
    </div>
  )
}
