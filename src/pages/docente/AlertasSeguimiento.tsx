import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, ArrowLeft } from 'lucide-react'
import { obtenerAlertasSeguimientoDocente } from '@/api/dashboard.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { NavbarDocente } from '@/components/layout/NavbarDocente'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { EstudianteBajoRendimiento } from '@/types/dashboardDocente.types'

export default function AlertasSeguimiento() {
  const { usuario } = useAuth()
  const [estudiantes, setEstudiantes] = useState<EstudianteBajoRendimiento[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    obtenerAlertasSeguimientoDocente()
      .then((datos) => {
        if (vigente) setEstudiantes(datos)
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
      <NavbarDocente usuario={usuario} raiz="Portal Docente" seccionActual="Alertas de Seguimiento" />

      <main className="flex-1 p-8">
        <Link
          to="/docente"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertOctagon size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Alertas de Seguimiento</h2>
            <p className="text-sm text-slate-500">
              Estudiantes con promedio bajo el umbral de rendimiento (3.0) en tus materias.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <p className="p-8 text-center text-sm text-red-500">{error}</p>
          ) : !estudiantes ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : estudiantes.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No hay estudiantes en seguimiento por ahora.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-6 py-3">Estudiante</th>
                  <th className="px-6 py-3">Grado</th>
                  <th className="px-6 py-3">Asignatura</th>
                  <th className="px-6 py-3 text-right">Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estudiantes.map((estudiante) => (
                  <tr key={`${estudiante.estudianteId}-${estudiante.nombreAsignatura}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar nombre={estudiante.nombreCompleto} />
                        <p className="font-medium text-slate-900">{estudiante.nombreCompleto}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{estudiante.gradoNombre}</td>
                    <td className="px-6 py-4 text-slate-700">{estudiante.nombreAsignatura}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge color="orange">Bajo Rendimiento · {estudiante.promedio.toFixed(1)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {estudiantes && estudiantes.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {estudiantes.length} {estudiantes.length === 1 ? 'estudiante en seguimiento' : 'estudiantes en seguimiento'}
          </p>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>
    </>
  )
}
