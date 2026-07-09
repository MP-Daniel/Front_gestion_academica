import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookMarked, ClipboardCheck, GraduationCap, IdCard } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { obtenerEstudiante } from '@/api/estudiantes.api'
import { obtenerDocente } from '@/api/docentes.api'
import { obtenerGrado } from '@/api/academico.api'
import { listarCargasPorGrado } from '@/api/cargaAcademica.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import { nombreCompleto } from '@/lib/utils'
import type { Estudiante } from '@/types/estudiante.types'
import type { CargaAcademica } from '@/types/carga.types'

export default function EstudiantePerfil() {
  const { id } = useParams<{ id: string }>()
  const { anioActivo } = useAnioLectivo()

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [nombreDirector, setNombreDirector] = useState<string | null>(null)
  const [cargas, setCargas] = useState<CargaAcademica[] | null>(null)
  const [errorCargas, setErrorCargas] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let vigente = true
    setError(null)

    obtenerEstudiante(Number(id))
      .then((datos) => {
        if (vigente) setEstudiante(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [id])

  useEffect(() => {
    if (!estudiante?.gradoActualId || !anioActivo) {
      setNombreDirector(null)
      setCargas(null)
      return
    }

    let vigente = true
    setErrorCargas(null)
    setCargas(null)

    obtenerGrado(estudiante.gradoActualId)
      .then((grado) => (grado.directorId ? obtenerDocente(grado.directorId) : null))
      .then((docente) => {
        if (vigente) setNombreDirector(docente ? nombreCompleto(docente) : null)
      })
      .catch(() => {
        if (vigente) setNombreDirector(null)
      })

    listarCargasPorGrado(estudiante.gradoActualId, anioActivo.anio)
      .then((datos) => {
        if (vigente) setCargas(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorCargas(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [estudiante, anioActivo])

  if (error) {
    return (
      <>
        <Navbar titulo="Perfil Académico" />
        <main className="flex-1 p-8">
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">{error}</p>
        </main>
      </>
    )
  }

  const nombre = estudiante ? nombreCompleto(estudiante) : ''

  return (
    <>
      <Navbar titulo="Perfil Académico" subtitulo="Institución Educativa Agrícola Fray Isidoro" />

      <main className="flex-1 p-8">
        <Link
          to="/admin/estudiantes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} />
          Volver al listado de estudiantes
        </Link>

        {!estudiante ? (
          <div className="mt-6 flex justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center gap-2 bg-brand-600 px-5 py-3 text-white">
                <IdCard size={18} />
                <h2 className="font-bold">Datos del Estudiante</h2>
              </div>
              <div className="flex items-center gap-4 p-5">
                <Avatar nombre={nombre} tamano="md" />
                <div>
                  <p className="text-lg font-bold text-slate-900">{nombre}</p>
                  <p className="text-sm text-slate-500">Documento de Identidad: {estudiante.documento}</p>
                  <Badge color={estudiante.activo ? 'brand' : 'red'}>
                    {estudiante.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-amber-500 px-5 py-3 text-white">
                <GraduationCap size={18} />
                <h2 className="font-bold">Información del Curso</h2>
              </div>
              <div className="p-5">
                {estudiante.gradoActualNombre ? (
                  <>
                    <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Grado actual
                    </p>
                    <p className="text-center text-2xl font-bold text-slate-900">{estudiante.gradoActualNombre}</p>
                    <div className="mt-2 flex justify-center">
                      <Badge color="brand">Matriculado</Badge>
                    </div>
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Año Lectivo</span>
                        <span className="font-semibold text-slate-900">{anioActivo?.anio ?? '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Director de Grupo</span>
                        <span className="font-semibold text-slate-900">{nombreDirector ?? 'Sin director asignado'}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <Badge color="slate">Sin matricular</Badge>
                    <p className="text-xs text-slate-400">
                      Este estudiante no tiene una matrícula activa en el año lectivo {anioActivo?.anio ?? 'actual'}.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
              <div className="flex items-center gap-2 bg-blue-600 px-5 py-3 text-white">
                <BookMarked size={18} />
                <h2 className="font-bold">Carga Académica (Asignaturas)</h2>
              </div>
              <div className="p-5">
                {!estudiante.gradoActualId ? (
                  <p className="text-center text-sm text-slate-400">
                    Sin materias — el estudiante no tiene una matrícula activa.
                  </p>
                ) : errorCargas ? (
                  <p className="text-center text-sm text-red-500">{errorCargas}</p>
                ) : !cargas ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : cargas.length === 0 ? (
                  <p className="text-center text-sm text-slate-400">No hay materias asignadas a este curso todavía.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cargas.map((carga) => (
                      <div
                        key={carga.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <BookMarked size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{carga.nombreAsignatura}</p>
                          <p className="text-xs text-slate-500">Doc. {carga.nombreDocente}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
              <div className="flex items-center gap-2 bg-slate-800 px-5 py-3 text-white">
                <ClipboardCheck size={18} />
                <h2 className="font-bold">Calificaciones por Periodo</h2>
              </div>
              <div className="flex flex-col items-center gap-2 p-10 text-center">
                <p className="text-sm font-medium text-slate-500">Módulo de notas en desarrollo</p>
                <p className="text-xs text-slate-400">
                  Las calificaciones por periodo estarán disponibles próximamente.
                </p>
              </div>
            </div>
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
