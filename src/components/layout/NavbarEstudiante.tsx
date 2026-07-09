import { Bell, ChevronRight, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { nombreCompleto } from '@/lib/utils'
import type { Usuario } from '@/types/auth.types'

interface NavbarEstudianteProps {
  usuario: Usuario
  gradoNombre?: string
  seccionActual: string
}

export function NavbarEstudiante({ usuario, gradoNombre, seccionActual }: NavbarEstudianteProps) {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-slate-200 bg-white px-8 py-5">
      <div className="flex shrink-0 items-center gap-2 text-sm">
        <span className="text-slate-400">Portal Académico</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold tracking-wide text-slate-600 uppercase">
          {seccionActual}
        </span>
      </div>

      <div className="w-full max-w-sm">
        <Input placeholder="Buscar..." icon={<Search size={16} />} />
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <button
          type="button"
          aria-label="Notificaciones"
          className="cursor-pointer rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <Bell size={20} />
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
