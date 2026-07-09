import { GraduationCap } from 'lucide-react'

interface TarjetaGradoProps {
  gradoNombre: string
  jornada: string | null
}

export function TarjetaGrado({ gradoNombre, jornada }: TarjetaGradoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tu Grado</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <GraduationCap size={18} />
        </div>
      </div>

      <p className="mt-2 text-3xl font-bold text-slate-900">{gradoNombre}</p>
      {jornada && <p className="text-sm text-slate-400">Jornada {jornada}</p>}

      <div className="relative mt-5 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-brand-600 via-accent-400 to-blue-900">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
          Símbolo institucional
        </span>
      </div>
    </div>
  )
}
