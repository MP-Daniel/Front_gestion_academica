import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'

interface NavbarProps {
  titulo: string
  subtitulo?: string
  sistemaEnLinea?: boolean
}

export function Navbar({ titulo, subtitulo, sistemaEnLinea = true }: NavbarProps) {
  const [selectorAbierto, setSelectorAbierto] = useState(false)
  const { anios, anioSeleccionado, seleccionarAnio, soloLectura } = useAnioLectivo()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{titulo}</h1>
        {subtitulo && <p className="text-sm text-slate-500">{subtitulo}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setSelectorAbierto((valor) => !valor)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-right hover:bg-slate-50"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {soloLectura ? 'Consultando año' : 'Año académico activo'}
              </p>
              <p className={cn('text-xl font-bold', soloLectura ? 'text-accent-600' : 'text-blue-600')}>
                {anioSeleccionado?.anio ?? '—'}
              </p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {selectorAbierto && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSelectorAbierto(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {anios.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-slate-400">Sin años registrados</p>
                ) : (
                  [...anios]
                    .sort((a, b) => b.anio - a.anio)
                    .map((anio) => (
                      <button
                        key={anio.id}
                        type="button"
                        onClick={() => {
                          seleccionarAnio(anio.id)
                          setSelectorAbierto(false)
                        }}
                        className={cn(
                          'flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm hover:bg-slate-50',
                          anio.id === anioSeleccionado?.id ? 'font-semibold text-brand-700' : 'text-slate-700',
                        )}
                      >
                        {anio.anio}
                        {anio.activo && <span className="text-xs text-brand-600">Activo</span>}
                      </button>
                    ))
                )}
              </div>
            </>
          )}
        </div>

        <span
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
            sistemaEnLinea ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500',
          )}
        >
          <span
            className={cn('h-2 w-2 rounded-full', sistemaEnLinea ? 'bg-brand-600' : 'bg-slate-400')}
          />
          {sistemaEnLinea ? 'Sistema en línea' : 'Sistema fuera de línea'}
        </span>

        <Link
          to="/admin/configuracion"
          aria-label="Configuración"
          className="cursor-pointer rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  )
}
