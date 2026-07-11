import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatearFechaCorta } from '@/lib/utils'
import type { EventoProximo } from '@/types/dashboardEstudiante.types'

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
          const { dia, mes } = formatearFechaCorta(evento.fecha)
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

      <Link
        to="/estudiante/calendario"
        className="mt-5 block w-full text-center text-xs font-semibold tracking-wide text-brand-700 uppercase hover:text-brand-800"
      >
        Ver calendario completo
      </Link>
    </div>
  )
}
