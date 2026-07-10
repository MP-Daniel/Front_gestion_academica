import type { ReactNode } from 'react'
import { Bell, ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { nombreCompleto } from '@/lib/utils'
import type { Usuario } from '@/types/auth.types'

interface NavbarEstudianteProps {
  usuario: Usuario
  gradoNombre?: string
  raiz?: string
  seccionActual: string
  children?: ReactNode
}

export function NavbarEstudiante({
  usuario,
  gradoNombre,
  raiz = 'Portal Académico',
  seccionActual,
  children,
}: NavbarEstudianteProps) {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-8 py-5">
      <div className="flex shrink-0 items-center gap-2 text-sm">
        <span className="text-slate-400">{raiz}</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-semibold text-brand-700">{seccionActual}</span>
      </div>

      {children && <div className="min-w-0 flex-1">{children}</div>}

      <div className="flex shrink-0 items-center gap-5">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative cursor-pointer rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{nombreCompleto(usuario)}</p>
            {gradoNombre && <p className="text-xs text-slate-400">Grado {gradoNombre}</p>}
          </div>
          <Avatar nombre={nombreCompleto(usuario)} tamano="md" />
        </div>
      </div>
    </header>
  )
}
