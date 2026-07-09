import { useEffect, useState } from 'react'
import { obtenerDashboardEstudiante } from '@/api/dashboard.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { NavbarEstudiante } from '@/components/layout/NavbarEstudiante'
import { BienvenidaBanner } from '@/components/estudiante/BienvenidaBanner'
import { TarjetaGrado } from '@/components/estudiante/TarjetaGrado'
import { TarjetaPromedio } from '@/components/estudiante/TarjetaPromedio'
import { ProximosEventos } from '@/components/estudiante/ProximosEventos'
import { AsignaturasHoy } from '@/components/estudiante/AsignaturasHoy'
import { nombreCompleto } from '@/lib/utils'
import type { DashboardEstudiante } from '@/types/dashboardEstudiante.types'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardEstudiante | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    obtenerDashboardEstudiante()
      .then((datos) => {
        if (vigente) setDashboard(datos)
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
      <NavbarEstudiante usuario={usuario} gradoNombre={dashboard?.estudiante.gradoNombre} seccionActual="Inicio" />

      <main className="flex-1 p-8">
        {error ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
            {error}
          </p>
        ) : !dashboard ? (
          <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <BienvenidaBanner nombre={nombreCompleto(usuario)} entregasPendientes={dashboard.entregasPendientes} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <TarjetaGrado gradoNombre={dashboard.estudiante.gradoNombre} jornada={dashboard.estudiante.jornada} />
              <TarjetaPromedio {...dashboard.promedioGeneral} />
              <ProximosEventos eventos={dashboard.proximosEventos} />
            </div>

            <AsignaturasHoy asignaturas={dashboard.asignaturasHoy} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>
    </>
  )
}
