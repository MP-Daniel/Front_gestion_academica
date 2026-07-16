import { useEffect, useState } from 'react'
import { BookOpen, GraduationCap, IdCard, Layers3, School } from 'lucide-react'
import { obtenerDashboardAdmin } from '@/api/dashboard.api'
import { Navbar } from '@/components/layout/Navbar'
import { StatCard } from '@/components/ui/StatCard'
import { Spinner } from '@/components/ui/Spinner'
import type { DashboardAdmin } from '@/types/dashboardAdmin.types'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardAdmin | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard etiqueta="Total Estudiantes" valor={dashboard?.totalEstudiantes ?? 0} icono={GraduationCap} color="blue" />
            <StatCard etiqueta="Matrículas Activas" valor={dashboard?.matriculasActivas ?? 0} icono={School} color="brand" />
            <StatCard etiqueta="Docentes Activos" valor={dashboard?.docentesActivos ?? 0} icono={IdCard} color="accent" />
            <StatCard etiqueta="Total Asignaturas" valor={dashboard?.totalAsignaturas ?? 0} icono={BookOpen} color="blue" />
            <StatCard etiqueta="Total Grados" valor={dashboard?.totalGrados ?? 0} icono={Layers3} color="brand" />
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
