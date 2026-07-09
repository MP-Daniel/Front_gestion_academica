import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookMarked,
  BookOpen,
  FileText,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn, nombreCompleto } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import type { Rol } from '@/types/auth.types'
import logoIe from '@/assets/logo-ie-descanse.png'

interface ItemNav {
  etiqueta: string
  ruta: string
  icono: LucideIcon
}

const NAV_POR_ROL: Record<Rol, ItemNav[]> = {
  ADMIN: [
    { etiqueta: 'Dashboard', ruta: '/admin', icono: LayoutDashboard },
    { etiqueta: 'Docentes', ruta: '/admin/docentes', icono: Users },
    { etiqueta: 'Estudiantes', ruta: '/admin/estudiantes', icono: GraduationCap },
    { etiqueta: 'Cursos', ruta: '/admin/cursos', icono: BookOpen },
    { etiqueta: 'Materias', ruta: '/admin/materias', icono: BookMarked },
    { etiqueta: 'Reportes', ruta: '/admin/reportes', icono: BarChart3 },
    { etiqueta: 'Configuración', ruta: '/admin/configuracion', icono: Settings },
  ],
  DOCENTE: [{ etiqueta: 'Dashboard', ruta: '/docente', icono: LayoutDashboard }],
  ESTUDIANTE: [
    { etiqueta: 'Inicio', ruta: '/estudiante', icono: Home },
    { etiqueta: 'Calificaciones', ruta: '/estudiante/calificaciones', icono: FileText },
    { etiqueta: 'Documentos', ruta: '/estudiante/documentos', icono: FolderOpen },
    { etiqueta: 'Mi Perfil', ruta: '/estudiante/perfil', icono: User },
  ],
}

const NAV_SECUNDARIO_POR_ROL: Partial<Record<Rol, ItemNav[]>> = {
  ESTUDIANTE: [
    { etiqueta: 'Configuración', ruta: '/estudiante/configuracion', icono: Settings },
    { etiqueta: 'Soporte', ruta: '/estudiante/soporte', icono: HelpCircle },
  ],
}

export function Sidebar() {
  const { usuario, cerrarSesion } = useAuth()
  const items = usuario ? NAV_POR_ROL[usuario.rol] : []
  const itemsSecundarios = usuario ? (NAV_SECUNDARIO_POR_ROL[usuario.rol] ?? []) : []

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <img src={logoIe} alt="Escudo institucional" className="h-11 w-11 object-contain" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-900">IE FRAY ISIDORO</p>
          <p className="text-xs font-bold tracking-wide text-brand-700 uppercase">de Montclar</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
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

        {itemsSecundarios.length > 0 && (
          <div className="mt-auto space-y-1 border-t border-slate-100 pt-3">
            {itemsSecundarios.map(({ etiqueta, ruta, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
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
          </div>
        )}
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
