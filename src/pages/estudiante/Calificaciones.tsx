import { useEffect, useState } from 'react'
import { Award, CheckCircle2, Download, TrendingDown, TrendingUp } from 'lucide-react'
import { obtenerCalificacionesEstudiante } from '@/api/calificaciones.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { NavbarEstudiante } from '@/components/layout/NavbarEstudiante'
import { TarjetaIndicador } from '@/components/estudiante/TarjetaIndicador'
import { BandaAnioLectivo } from '@/components/estudiante/BandaAnioLectivo'
import { RegistroAcademico } from '@/components/estudiante/RegistroAcademico'
import type { CalificacionesEstudiante } from '@/types/calificaciones.types'

export default function Calificaciones() {
  const { usuario } = useAuth()
  const [calificaciones, setCalificaciones] = useState<CalificacionesEstudiante | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    obtenerCalificacionesEstudiante()
      .then((datos) => {
        if (vigente) setCalificaciones(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  if (!usuario) return null

  const { resumen } = calificaciones ?? {}
  const mejorando = (resumen?.variacionPeriodoAnterior ?? 0) >= 0

  return (
    <>
      <NavbarEstudiante
        usuario={usuario}
        gradoNombre={calificaciones?.anioLectivo.gradoNombre}
        raiz="Académico"
        seccionActual="Detalle de Notas"
      >
        <div className="flex justify-end">
          <div className="w-fit">
            <Button type="button">
              <Download size={16} />
              Descargar Boletín
            </Button>
          </div>
        </div>
      </NavbarEstudiante>

      <main className="flex-1 p-8">
        {error ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
            {error}
          </p>
        ) : !calificaciones ? (
          <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900">Mis Calificaciones</h2>

            <BandaAnioLectivo anioLectivo={calificaciones.anioLectivo} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TarjetaIndicador
                icono={mejorando ? TrendingUp : TrendingDown}
                colorIcono="bg-brand-50 text-brand-700"
                valor={calificaciones.resumen.promedioGeneral.toFixed(1)}
                etiqueta="Promedio General"
                insignia={{
                  texto: `${mejorando ? '+' : ''}${calificaciones.resumen.variacionPeriodoAnterior.toFixed(1)}`,
                  color: mejorando ? 'brand' : 'red',
                }}
              />
              <TarjetaIndicador
                icono={CheckCircle2}
                colorIcono="bg-blue-50 text-blue-600"
                valor={`${calificaciones.resumen.asignaturasAprobadas}/${calificaciones.resumen.totalAsignaturas}`}
                etiqueta="Asignaturas Aprobadas"
                insignia={{
                  texto:
                    calificaciones.resumen.totalAsignaturas > 0
                      ? `${Math.round(
                          (calificaciones.resumen.asignaturasAprobadas / calificaciones.resumen.totalAsignaturas) * 100,
                        )}%`
                      : '—',
                  color: 'blue',
                }}
              />
              <TarjetaIndicador
                icono={Award}
                colorIcono="bg-accent-100 text-accent-600"
                valor={calificaciones.resumen.puestoEnGrupo ? `${calificaciones.resumen.puestoEnGrupo}°` : '—'}
                etiqueta="Puesto en Grupo"
                insignia={{ texto: `de ${calificaciones.resumen.totalEstudiantesGrupo}`, color: 'accent' }}
              />
            </div>

            <RegistroAcademico asignaturas={calificaciones.asignaturas} />
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
