import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn, nombreCompleto } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import type { Rol } from '@/types/auth.types'

interface ItemNav {
  etiqueta: string
  ruta: string
  icono: LucideIcon
}

const NAV_POR_ROL: Record<Rol, ItemNav[]> = {
  ADMIN: [
    { etiqueta: 'Dashboard', ruta: '/admin', icono: LayoutDashboard },
    { etiqueta: 'Docentes', ruta: '/admin/docentes', icono: Users },
    { etiqueta: 'Cursos', ruta: '/admin/cursos', icono: BookOpen },
    { etiqueta: 'Matrícula', ruta: '/admin/matricula', icono: ClipboardList },
    { etiqueta: 'Reportes', ruta: '/admin/reportes', icono: BarChart3 },
    { etiqueta: 'Configuración', ruta: '/admin/configuracion', icono: Settings },
  ],
  DOCENTE: [{ etiqueta: 'Dashboard', ruta: '/docente', icono: LayoutDashboard }],
  ESTUDIANTE: [{ etiqueta: 'Dashboard', ruta: '/estudiante', icono: LayoutDashboard }],
}

export function Sidebar() {
  const { usuario, cerrarSesion } = useAuth()
  const items = usuario ? NAV_POR_ROL[usuario.rol] : []

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <GraduationCap size={20} />
        </div>
        <span className="text-sm font-bold tracking-wide text-brand-700">GEST - ACADÉMICO</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map(({ etiqueta, ruta, icono: Icono }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50',
              )
            }
          >
            <Icono size={18} />
            {etiqueta}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-4">
        <Avatar nombre={usuario ? nombreCompleto(usuario) : ''} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {usuario && nombreCompleto(usuario)}
          </p>
          <p className="truncate text-xs text-slate-500">{usuario?.email}</p>
        </div>
        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={cerrarSesion}
          className="shrink-0 cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
