import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { NavbarEstudiante } from '@/components/layout/NavbarEstudiante'
import { FormularioSoporte } from '@/components/soporte/FormularioSoporte'
import { TarjetaSolicitud } from '@/components/soporte/TarjetaSolicitud'
import { listarMisSolicitudesSoporte } from '@/api/soporte.api'
import { extraerMensajeError } from '@/api/axios'
import type { SolicitudSoporte } from '@/types/soporte.types'

export default function Soporte() {
  const { usuario } = useAuth()
  const [solicitudes, setSolicitudes] = useState<SolicitudSoporte[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    listarMisSolicitudesSoporte()
      .then((datos) => {
        if (vigente) setSolicitudes(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  if (!usuario) return null

  return (
    <>
      <NavbarEstudiante usuario={usuario} seccionActual="Soporte" />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Soporte</h2>
        <p className="mt-1 text-sm text-slate-500">
          Crea una solicitud si tienes un problema técnico o una duda académica.
        </p>

        <div className="mt-6 flex flex-col gap-6">
          <FormularioSoporte onCreada={(nueva) => setSolicitudes((actual) => [nueva, ...(actual ?? [])])} />

          {error ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
              {error}
            </p>
          ) : !solicitudes ? (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner />
            </div>
          ) : solicitudes.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              Aún no has creado ninguna solicitud de soporte.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {solicitudes.map((solicitud) => (
                <TarjetaSolicitud key={solicitud.id} solicitud={solicitud} />
              ))}
            </div>
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
