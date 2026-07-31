import { MessageSquareText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatearFechaHora } from '@/lib/utils'
import { COLOR_CATEGORIA, COLOR_ESTADO, ETIQUETA_CATEGORIA, ETIQUETA_ESTADO } from '@/lib/soporte'
import type { SolicitudSoporte } from '@/types/soporte.types'

interface TarjetaSolicitudProps {
  solicitud: SolicitudSoporte
}

export function TarjetaSolicitud({ solicitud }: TarjetaSolicitudProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold break-words text-slate-900">{solicitud.asunto}</p>
          <p className="mt-0.5 text-xs text-slate-400">{formatearFechaHora(solicitud.fechaCreacion)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Badge color={COLOR_CATEGORIA[solicitud.categoria]}>{ETIQUETA_CATEGORIA[solicitud.categoria]}</Badge>
          <Badge color={COLOR_ESTADO[solicitud.estado]}>{ETIQUETA_ESTADO[solicitud.estado]}</Badge>
        </div>
      </div>

      <p className="mt-3 text-sm break-words text-slate-600">{solicitud.descripcion}</p>

      {solicitud.respuestaAdmin && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 p-3">
          <MessageSquareText size={16} className="mt-0.5 shrink-0 text-brand-600" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand-700 uppercase">Respuesta</p>
            <p className="text-sm break-words text-brand-700">{solicitud.respuestaAdmin}</p>
          </div>
        </div>
      )}
    </div>
  )
}
