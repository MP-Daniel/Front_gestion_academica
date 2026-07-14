import { AlertTriangle } from 'lucide-react'

const RADIO = 42
const CIRCUNFERENCIA = 2 * Math.PI * RADIO

interface CierrePeriodoProps {
  nombrePeriodo: string
  porcentajeCompletado: number
  diasRestantes: number
  planillasSinCalificar: number
}

export function CierrePeriodo({
  nombrePeriodo,
  porcentajeCompletado,
  diasRestantes,
  planillasSinCalificar,
}: CierrePeriodoProps) {
  const offset = CIRCUNFERENCIA - (porcentajeCompletado / 100) * CIRCUNFERENCIA

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Cierre de {nombrePeriodo}</p>

      <div className="relative mx-auto mt-4 flex h-28 w-28 items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={RADIO} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100" />
          <circle
            cx="56"
            cy="56"
            r={RADIO}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-brand-600"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-slate-900">{porcentajeCompletado}%</span>
        </div>
      </div>

      <p className="mt-3 text-center text-sm text-slate-500">
        Quedan <span className="font-semibold text-slate-900">{diasRestantes}</span>{' '}
        {diasRestantes === 1 ? 'día' : 'días'}
      </p>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-accent-100 p-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent-600" />
        <p className="text-xs text-accent-700">
          Tienes <span className="font-semibold">{planillasSinCalificar}</span>{' '}
          {planillasSinCalificar === 1 ? 'planilla sin calificar' : 'planillas sin calificar'}. Ciérralas antes de
          que finalice el periodo.
        </p>
      </div>
    </div>
  )
}
