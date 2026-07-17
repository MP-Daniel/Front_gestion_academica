import { useEffect, useState } from 'react'
import { listarEventos } from '@/api/eventos.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { Navbar } from '@/components/layout/Navbar'
import { NavbarEstudiante } from '@/components/layout/NavbarEstudiante'
import { formatearFechaCorta } from '@/lib/utils'
import type { EventoInstitucional } from '@/types/eventos.types'

export default function Calendario() {
  const { usuario } = useAuth()
  const [eventos, setEventos] = useState<EventoInstitucional[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    listarEventos()
      .then((datos) => {
        if (vigente) setEventos(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  if (!usuario) return null

  const esAdministrador = usuario.rol === 'ADMIN'

  return (
    <>
      {esAdministrador ? (
        <Navbar
          titulo="Calendario Institucional"
          subtitulo="Eventos y actividades programadas por la institución"
        />
      ) : (
        <NavbarEstudiante usuario={usuario} seccionActual="Calendario" />
      )}

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Calendario Institucional</h2>
        <p className="mt-1 text-sm text-slate-500">Todos los eventos programados por la institución.</p>

        <div className="mt-6">
          {error ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
              {error}
            </p>
          ) : !eventos ? (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner />
            </div>
          ) : eventos.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No hay eventos institucionales registrados.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {eventos.map((evento) => {
                const { dia, mes } = formatearFechaCorta(evento.fecha)
                return (
                  <li
                    key={evento.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-brand-50 py-2 text-brand-700">
                      <span className="text-xl leading-none font-bold">{dia}</span>
                      <span className="text-xs leading-none font-semibold">{mes}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{evento.titulo}</p>
                      <p className="text-sm text-slate-500">{evento.descripcion}</p>
                    </div>
                    {evento.lugar && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        {evento.lugar}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>
    </>
  )
}
