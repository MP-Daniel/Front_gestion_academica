import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookMarked, ClipboardCheck, GraduationCap, IdCard, Lock, Unlock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { obtenerEstudiante } from '@/api/estudiantes.api'
import { obtenerDocente } from '@/api/docentes.api'
import { listarGrados } from '@/api/academico.api'
import { listarCargasPorGrado } from '@/api/cargaAcademica.api'
import { historialMatriculasEstudiante } from '@/api/matriculas.api'
import { listarPeriodos } from '@/api/periodos.api'
import { bloquearNota, habilitarNota, obtenerNotasDefinitivas } from '@/api/notas.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import { nombreCompleto } from '@/lib/utils'
import type { Estudiante } from '@/types/estudiante.types'
import type { CargaAcademica } from '@/types/carga.types'
import type { Periodo } from '@/types/periodo.types'
import type { NotaDefinitiva } from '@/types/nota.types'
import type { EstadoMatricula, Matricula } from '@/types/matricula.types'

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

export default function EstudiantePerfil() {
  const { id } = useParams<{ id: string }>()
  const { anioActivo } = useAnioLectivo()

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [matriculaActual, setMatriculaActual] = useState<Matricula | null>(null)
  const [cargandoInfo, setCargandoInfo] = useState(false)
  const [errorInfo, setErrorInfo] = useState<string | null>(null)

  const [nombreDirector, setNombreDirector] = useState<string | null>(null)
  const [cargas, setCargas] = useState<CargaAcademica[] | null>(null)
  const [errorCargas, setErrorCargas] = useState<string | null>(null)

  const [periodos, setPeriodos] = useState<Periodo[] | null>(null)
  const [notas, setNotas] = useState<NotaDefinitiva[] | null>(null)
  const [errorNotas, setErrorNotas] = useState<string | null>(null)

  const [notasHabilitadas, setNotasHabilitadas] = useState<Set<number>>(new Set())
  const [cambiandoEdicionId, setCambiandoEdicionId] = useState<number | null>(null)
  const [errorCambiarEdicion, setErrorCambiarEdicion] = useState<string | null>(null)

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
    if (!estudiante || !anioActivo) {
      setMatriculaActual(null)
      setNombreDirector(null)
      setCargas(null)
      setPeriodos(null)
      return
    }

    let vigente = true
    setCargandoInfo(true)
    setErrorInfo(null)
    setMatriculaActual(null)
    setNombreDirector(null)
    setCargas(null)
    setErrorCargas(null)
    setPeriodos(null)
    setErrorNotas(null)

    historialMatriculasEstudiante(estudiante.documento)
      .then((historial) => {
        if (!vigente) return
        const matricula = historial.find((m) => m.anioLectivo === anioActivo.anio) ?? null
        setMatriculaActual(matricula)
        if (!matricula) return

        listarGrados()
          .then((grados) => {
            const grado = grados.find((g) => g.nombre.toLowerCase() === matricula.nombreGrado.toLowerCase())
            if (!grado) return

            listarCargasPorGrado(grado.id, anioActivo.anio)
              .then((datos) => {
                if (vigente) setCargas(datos)
              })
              .catch((error: unknown) => {
                if (vigente) setErrorCargas(extraerMensajeError(error))
              })

            if (grado.directorId) {
              obtenerDocente(grado.directorId)
                .then((docente) => {
                  if (vigente) setNombreDirector(nombreCompleto(docente))
                })
                .catch(() => {
                  if (vigente) setNombreDirector(null)
                })
            }
          })
          .catch((error: unknown) => {
            if (vigente) setErrorCargas(extraerMensajeError(error))
          })
      })
      .catch((error: unknown) => {
        if (vigente) setErrorInfo(extraerMensajeError(error))
      })
      .finally(() => {
        if (vigente) setCargandoInfo(false)
      })

    listarPeriodos(anioActivo.id)
      .then((datos) => {
        if (vigente) setPeriodos([...datos].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)))
      })
      .catch((error: unknown) => {
        if (vigente) setErrorNotas(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [estudiante, anioActivo])

  useEffect(() => {
    if (!matriculaActual) {
      setNotas(null)
      return
    }

    let vigente = true
    setErrorNotas(null)
    setNotas(null)
    setNotasHabilitadas(new Set())

    obtenerNotasDefinitivas(matriculaActual.id)
      .then((datos) => {
        if (vigente) setNotas(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorNotas(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [matriculaActual])

  const alternarEdicionNota = async (notaId: number, accion: 'habilitar' | 'bloquear') => {
    setCambiandoEdicionId(notaId)
    setErrorCambiarEdicion(null)
    try {
      if (accion === 'habilitar') {
        await habilitarNota(notaId)
        setNotasHabilitadas((actual) => new Set(actual).add(notaId))
      } else {
        await bloquearNota(notaId)
        setNotasHabilitadas((actual) => {
          const siguiente = new Set(actual)
          siguiente.delete(notaId)
          return siguiente
        })
      }
    } catch (error) {
      const mensaje = extraerMensajeError(error)
      setErrorCambiarEdicion(mensaje)
      // El backend no expone el estado actual de habilitadaParaEdicion, así que si la
      // acción falla porque ya estaba en ese estado, autocorregimos el estado local con
      // el dato que el propio mensaje de error nos acaba de confirmar.
      if (mensaje.toLowerCase().includes('ya está')) {
        setNotasHabilitadas((actual) => {
          const siguiente = new Set(actual)
          if (accion === 'habilitar') siguiente.add(notaId)
          else siguiente.delete(notaId)
          return siguiente
        })
      }
    } finally {
      setCambiandoEdicionId(null)
    }
  }

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
                {cargandoInfo ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : errorInfo ? (
                  <p className="text-center text-sm text-red-500">{errorInfo}</p>
                ) : matriculaActual ? (
                  <>
                    <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Grado
                    </p>
                    <p className="text-center text-2xl font-bold text-slate-900">{matriculaActual.nombreGrado}</p>
                    <div className="mt-2 flex justify-center">
                      <Badge color={COLOR_ESTADO[matriculaActual.estado]}>{matriculaActual.estado}</Badge>
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
                      Este estudiante no tiene ninguna matrícula en el año lectivo {anioActivo?.anio ?? 'actual'}.
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
                {!matriculaActual ? (
                  <p className="text-center text-sm text-slate-400">
                    Sin materias — el estudiante no tiene ninguna matrícula en este año.
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
              <div className="p-5">
                {!matriculaActual ? (
                  <p className="text-center text-sm text-slate-400">
                    Sin calificaciones — el estudiante no tiene ninguna matrícula en este año.
                  </p>
                ) : errorNotas ? (
                  <p className="text-center text-sm text-red-500">{errorNotas}</p>
                ) : !notas || !periodos ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : notas.length === 0 ? (
                  <p className="text-center text-sm text-slate-400">
                    No hay notas registradas para este estudiante en el año {anioActivo?.anio}.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          <th className="px-4 py-2">Asignatura</th>
                          {periodos.map((periodo) => (
                            <th key={periodo.id} className="px-4 py-2 text-center">
                              {periodo.nombre}
                              <span className="block font-normal normal-case text-slate-400">
                                ({periodo.porcentaje}%)
                              </span>
                            </th>
                          ))}
                          <th className="px-4 py-2 text-center">Definitiva</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {notas.map((nota) => (
                          <tr key={nota.cargaAcademicaId}>
                            <td className="px-4 py-3 font-medium text-slate-900">{nota.nombreAsignatura}</td>
                            {periodos.map((periodo) => {
                              const detalle = nota.notasPorPeriodo.find(
                                (np) => np.nombrePeriodo === periodo.nombre,
                              )
                              const habilitada = detalle ? notasHabilitadas.has(detalle.id) : false

                              return (
                                <td key={periodo.id} className="px-4 py-3 text-center text-slate-700">
                                  {detalle ? (
                                    <div className="flex flex-col items-center gap-1">
                                      <span>{detalle.valor.toFixed(2)}</span>
                                      {periodo.cerradoParaDocentes && (
                                        <div className="flex items-center gap-1.5">
                                          {habilitada ? (
                                            <>
                                              <Badge color="brand">Habilitada</Badge>
                                              <button
                                                type="button"
                                                aria-label={`Bloquear edición de ${nota.nombreAsignatura} - ${periodo.nombre}`}
                                                disabled={cambiandoEdicionId === detalle.id}
                                                onClick={() => alternarEdicionNota(detalle.id, 'bloquear')}
                                                className="cursor-pointer text-slate-400 hover:text-slate-600 disabled:opacity-50"
                                                title="Bloquear edición puntual"
                                              >
                                                <Lock size={13} />
                                              </button>
                                            </>
                                          ) : (
                                            <button
                                              type="button"
                                              aria-label={`Habilitar edición de ${nota.nombreAsignatura} - ${periodo.nombre}`}
                                              disabled={cambiandoEdicionId === detalle.id}
                                              onClick={() => alternarEdicionNota(detalle.id, 'habilitar')}
                                              className="cursor-pointer text-brand-600 hover:text-brand-700 disabled:opacity-50"
                                              title="Habilitar edición puntual"
                                            >
                                              <Unlock size={13} />
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                              )
                            })}
                            <td className="px-4 py-3 text-center font-bold text-slate-900">
                              {nota.notaDefinitiva.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {errorCambiarEdicion && <p className="mt-2 text-sm text-red-500">{errorCambiarEdicion}</p>}
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
