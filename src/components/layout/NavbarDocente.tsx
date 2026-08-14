import { useState } from 'react'
import { Bell, ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { nombreCompleto } from '@/lib/utils'
import type { Usuario } from '@/types/auth.types'

interface NavbarDocenteProps {
  usuario: Usuario
  cargo?: string
  raiz?: string
  seccionActual: string
}

export function NavbarDocente({ usuario, cargo = '', raiz = 'Portal Docente', seccionActual }: NavbarDocenteProps) {
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [haySinLeer, setHaySinLeer] = useState(true)

  return (
    <header className="flex h-21 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 pl-16 py-5 sm:pr-8 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className="hidden truncate text-slate-400 sm:inline">{raiz}</span>
        <ChevronRight size={14} className="hidden shrink-0 text-slate-300 sm:block" />
        <span className="truncate font-semibold text-brand-700">{seccionActual}</span>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-4 lg:gap-5">
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Notificaciones"
            onClick={() => {
              setNotificacionesAbiertas((abierto) => !abierto)
              setHaySinLeer(false)
            }}
            className="relative cursor-pointer rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Bell size={20} />
            {haySinLeer && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
          </button>

          {notificacionesAbiertas && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotificacionesAbiertas(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Notificaciones
                </p>
                <p className="px-4 py-4 text-center text-sm text-slate-400">No tienes notificaciones nuevas.</p>
              </div>
            </>
          )}
        </div>

        <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden max-w-[8rem] min-w-0 text-right sm:block lg:max-w-[14rem]">
            <p className="truncate text-sm font-bold text-slate-900">{nombreCompleto(usuario)}</p>
            {cargo && <p className="truncate text-xs text-slate-400">{cargo}</p>}
          </div>
          <Avatar nombre={nombreCompleto(usuario)} tamano="md" />
        </div>
      </div>
    </header>
  )
}
