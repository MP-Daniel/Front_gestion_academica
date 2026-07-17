import { useEffect, useState } from 'react'
import { BookOpen, GraduationCap, IdCard, Layers3 } from 'lucide-react'
import { obtenerDashboardAdmin } from '@/api/dashboard.api'
import { listarEventos } from '@/api/eventos.api'
import { extraerMensajeError } from '@/api/axios'
import { Navbar } from '@/components/layout/Navbar'
import { StatCard } from '@/components/ui/StatCard'
import { Spinner } from '@/components/ui/Spinner'
import { ProximosEventos } from '@/components/eventos/ProximosEventos'
import type { DashboardAdmin } from '@/types/dashboardAdmin.types'
import type { EventoInstitucional } from '@/types/eventos.types'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardAdmin | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventos, setEventos] = useState<EventoInstitucional[]>([])
  const [cargandoEventos, setCargandoEventos] = useState(true)
  const [errorEventos, setErrorEventos] = useState<string | null>(null)

  useEffect(() => {
    let activo = true

    setCargando(true)
    setError(null)

    obtenerDashboardAdmin()
      .then((datos) => {
        if (activo) setDashboard(datos)
      })
      .catch(() => {
        if (activo) setError('No fue posible cargar los indicadores del panel.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    listarEventos()
      .then((datos) => {
        if (activo) setEventos(datos)
      })
      .catch((error: unknown) => {
        if (activo) setErrorEventos(extraerMensajeError(error))
      })
      .finally(() => {
        if (activo) setCargandoEventos(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return (
    <>
      <Navbar
        titulo="Panel de Control"
        subtitulo="Institución Educativa Agrícola Fray Isidoro"
        sistemaEnLinea
      />

      <main className="flex-1 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>
            <p className="text-sm text-slate-500">
              Vista general del progreso académico y administrativo.
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="mt-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500 shadow-sm">
            <Spinner size={20} />
            Cargando indicadores del panel...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.85fr)_minmax(0,1.25fr)] xl:gap-4 xl:items-start">
            <div className="flex flex-col gap-6 text-slate-900">
              <article className="relative w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]">
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-brand-600 via-brand-500 to-accent-500" />
                <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-brand-100/70 blur-3xl" />
                <div className="absolute -bottom-16 right-6 h-32 w-32 rounded-full bg-accent-100/80 blur-3xl" />

                <div className="relative flex items-start justify-between gap-6">
                  <div className="relative z-10 min-w-0">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Total estudiantes
                    </p>
                    <p className="mt-1 text-4xl font-black leading-none text-slate-900">
                      {dashboard?.totalEstudiantes ?? 0}
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Matriculados
                      </p>
                      <p className="mt-1 text-2xl font-black leading-none text-slate-800">
                        {dashboard?.matriculasActivas ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute right-2 top-2 z-0 flex h-24 w-24 -translate-y-1/4 translate-x-1/4 -rotate-12 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 opacity-14 shadow-inner ring-1 ring-brand-100">
                    <GraduationCap size={82} strokeWidth={2.2} />
                  </div>
                </div>
              </article>
            </div>

            <div className="flex flex-col gap-4">
              <StatCard etiqueta="Docentes Activos" valor={dashboard?.docentesActivos ?? 0} icono={IdCard} color="accent" />
              <StatCard etiqueta="Total Asignaturas" valor={dashboard?.totalAsignaturas ?? 0} icono={BookOpen} color="blue" />
              <StatCard etiqueta="Total Grados" valor={dashboard?.totalGrados ?? 0} icono={Layers3} color="brand" />
            </div>

            {cargandoEventos ? (
              <section className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Spinner />
              </section>
            ) : errorEventos ? (
              <section className="flex min-h-80 items-center rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {errorEventos}
              </section>
            ) : (
              <ProximosEventos eventos={eventos} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>
    </>
  )
}
