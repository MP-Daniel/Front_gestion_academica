import { useEffect, useState } from 'react'
import { obtenerDashboardDocente } from '@/api/dashboard.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { NavbarDocente } from '@/components/layout/NavbarDocente'
import { BannerBienvenidaDocente } from '@/components/docente/BannerBienvenidaDocente'
import { CargaAcademica } from '@/components/docente/CargaAcademica'
import { CierrePeriodo } from '@/components/docente/CierrePeriodo'
import { AlertasSeguimiento } from '@/components/docente/AlertasSeguimiento'
import type { DashboardDocente } from '@/types/dashboardDocente.types'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardDocente | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    obtenerDashboardDocente()
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
      <NavbarDocente usuario={usuario} cargo={dashboard?.docente.cargo ?? ''} seccionActual="Inicio" />

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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <BannerBienvenidaDocente
                nombre={dashboard.docente.nombreCompleto}
                planillasPendientes={dashboard.planillasPendientes}
              />
              <CargaAcademica clases={dashboard.clasesDeHoy} />
              <AlertasSeguimiento estudiantes={dashboard.estudiantesBajoRendimiento} />
            </div>

            <div className="flex flex-col gap-6">
              <CierrePeriodo {...dashboard.cierrePeriodo} />
            </div>
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
