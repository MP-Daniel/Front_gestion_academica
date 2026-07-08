import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  titulo: string
  subtitulo?: string
  anioActivo: number
  sistemaEnLinea?: boolean
}

export function Navbar({ titulo, subtitulo, anioActivo, sistemaEnLinea = true }: NavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{titulo}</h1>
        {subtitulo && <p className="text-sm text-slate-500">{subtitulo}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Año académico activo
          </p>
          <p className="text-xl font-bold text-blue-600">{anioActivo}</p>
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
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Settings size={20} />
        </Link>
      </div>
    </header>
  )
}
