import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookMarked,
  ClipboardList,
  GraduationCap,
  History,
  Info,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Users,
  UserPlus,
  X,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { actualizarGrado, listarAsignaturas, listarGrados } from '@/api/academico.api'
import { listarDocentes } from '@/api/docentes.api'
import {
  cambiarEstadoMatricula,
  crearMatricula,
  historialMatriculasEstudiante,
  listarMatriculasPorGrado,
} from '@/api/matriculas.api'
import { crearCarga, eliminarCarga, listarCargasPorGrado, reasignarDocenteCarga } from '@/api/cargaAcademica.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import { cn, nombreCompleto } from '@/lib/utils'
import type { Asignatura, Grado } from '@/types/academico.types'
import type { Docente } from '@/types/docente.types'
import type { CargaAcademica } from '@/types/carga.types'
import type { EstadoMatricula, Matricula } from '@/types/matricula.types'

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

const ESTADOS: EstadoMatricula[] = ['ACTIVA', 'PROMOVIDA', 'REPROBADA', 'RETIRADA']

type TabId = 'informacion' | 'estudiantes' | 'materias'

const TABS: { id: TabId; etiqueta: string; icono: typeof Info }[] = [
  { id: 'informacion', etiqueta: 'Información General', icono: Info },
  { id: 'estudiantes', etiqueta: 'Estudiantes del Curso', icono: Users },
  { id: 'materias', etiqueta: 'Materias y Docentes', icono: BookMarked },
]

export default function CursoDetalle() {
  const { id } = useParams<{ id: string }>()
  const gradoId = Number(id)
  const { anioSeleccionado, soloLectura } = useAnioLectivo()

  const [tabActiva, setTabActiva] = useState<TabId>('informacion')

  const [grado, setGrado] = useState<Grado | null>(null)
  const [errorGrado, setErrorGrado] = useState<string | null>(null)
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])

  // Curso: editar nombre/director
  const [formGradoAbierto, setFormGradoAbierto] = useState(false)
  const [nombreGradoEditado, setNombreGradoEditado] = useState('')
  const [directorGradoEditado, setDirectorGradoEditado] = useState('')
  const [guardandoGrado, setGuardandoGrado] = useState(false)
  const [errorEdicionGrado, setErrorEdicionGrado] = useState<string | null>(null)

  const [matriculas, setMatriculas] = useState<Matricula[] | null>(null)
  const [errorMatriculas, setErrorMatriculas] = useState<string | null>(null)
  const [recargaMatriculas, setRecargaMatriculas] = useState(0)

  const [cargas, setCargas] = useState<CargaAcademica[] | null>(null)
  const [errorCargas, setErrorCargas] = useState<string | null>(null)
  const [recargaCargas, setRecargaCargas] = useState(0)

  // Matrícula: matricular estudiante
  const [formMatriculaAbierto, setFormMatriculaAbierto] = useState(false)
  const [documentoNuevo, setDocumentoNuevo] = useState('')
  const [creandoMatricula, setCreandoMatricula] = useState(false)
  const [errorCreacionMatricula, setErrorCreacionMatricula] = useState<string | null>(null)

  // Matrícula: cambiar estado
  const [matriculaEstado, setMatriculaEstado] = useState<Matricula | null>(null)
  const [nuevoEstado, setNuevoEstado] = useState<EstadoMatricula | ''>('')
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [errorEstado, setErrorEstado] = useState<string | null>(null)

  // Matrícula: historial
  const [historial, setHistorial] = useState<{ documento: string; nombre: string; datos: Matricula[] | null } | null>(
    null,
  )
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null)

  // Carga académica: asignar materia
  const [formCargaAbierto, setFormCargaAbierto] = useState(false)
  const [asignaturaNueva, setAsignaturaNueva] = useState('')
  const [docenteNuevo, setDocenteNuevo] = useState('')
  const [creandoCarga, setCreandoCarga] = useState(false)
  const [errorCreacionCarga, setErrorCreacionCarga] = useState<string | null>(null)

  // Carga académica: reasignar docente
  const [cargaAReasignar, setCargaAReasignar] = useState<CargaAcademica | null>(null)
  const [docenteReasignado, setDocenteReasignado] = useState('')
  const [reasignando, setReasignando] = useState(false)
  const [errorReasignar, setErrorReasignar] = useState<string | null>(null)

  // Carga académica: eliminar
  const [cargaAEliminar, setCargaAEliminar] = useState<CargaAcademica | null>(null)
  const [eliminandoCarga, setEliminandoCarga] = useState(false)
  const [errorEliminarCarga, setErrorEliminarCarga] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    Promise.all([
      listarGrados(),
      listarDocentes({ tamanoPagina: 100, incluirInactivos: false }),
      listarAsignaturas(),
    ])
      .then(([grados, paginaDocentes, datosAsignaturas]) => {
        if (!vigente) return
        setGrado(grados.find((g) => g.id === gradoId) ?? null)
        setDocentes(paginaDocentes.content)
        setAsignaturas(datosAsignaturas)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorGrado(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [gradoId])

  useEffect(() => {
    if (!anioSeleccionado) return
    let vigente = true
    setErrorMatriculas(null)
    setMatriculas(null)

    listarMatriculasPorGrado(gradoId, anioSeleccionado.anio)
      .then((datos) => {
        if (vigente) setMatriculas(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorMatriculas(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [gradoId, anioSeleccionado, recargaMatriculas])

  useEffect(() => {
    if (!anioSeleccionado) return
    let vigente = true
    setErrorCargas(null)
    setCargas(null)

    listarCargasPorGrado(gradoId, anioSeleccionado.anio)
      .then((datos) => {
        if (vigente) setCargas(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorCargas(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [gradoId, anioSeleccionado, recargaCargas])

  const nombreDirector = (directorId: number | null) => {
    if (directorId === null) return null
    return docentes.find((d) => d.id === directorId)
  }

  const abrirEdicionGrado = () => {
    if (!grado) return
    setNombreGradoEditado(grado.nombre)
    setDirectorGradoEditado(grado.directorId ? String(grado.directorId) : '')
    setErrorEdicionGrado(null)
    setFormGradoAbierto(true)
  }

  const manejarGuardarGrado = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!grado) return
    if (!nombreGradoEditado.trim()) {
      setErrorEdicionGrado('El nombre del curso es obligatorio.')
      return
    }
    if (!directorGradoEditado) {
      setErrorEdicionGrado('Debes seleccionar un director de grupo.')
      return
    }

    setGuardandoGrado(true)
    setErrorEdicionGrado(null)
    try {
      const actualizado = await actualizarGrado(grado.id, {
        nombre: nombreGradoEditado.trim(),
        directorId: Number(directorGradoEditado),
      })
      setGrado(actualizado)
      setFormGradoAbierto(false)
    } catch (error) {
      setErrorEdicionGrado(extraerMensajeError(error))
    } finally {
      setGuardandoGrado(false)
    }
  }

  const manejarCrearMatricula = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!anioSeleccionado) return
    if (!documentoNuevo.trim()) {
      setErrorCreacionMatricula('El documento del estudiante es obligatorio.')
      return
    }

    setCreandoMatricula(true)
    setErrorCreacionMatricula(null)
    try {
      await crearMatricula({
        documentoEstudiante: documentoNuevo.trim(),
        gradoId,
        anio: anioSeleccionado.anio,
      })
      setDocumentoNuevo('')
      setFormMatriculaAbierto(false)
      setRecargaMatriculas((valor) => valor + 1)
    } catch (error) {
      setErrorCreacionMatricula(extraerMensajeError(error))
    } finally {
      setCreandoMatricula(false)
    }
  }

  const confirmarCambioEstado = async () => {
    if (!matriculaEstado || !nuevoEstado) return

    setCambiandoEstado(true)
    setErrorEstado(null)
    try {
      await cambiarEstadoMatricula(matriculaEstado.id, { nuevoEstado })
      setMatriculaEstado(null)
      setNuevoEstado('')
      setRecargaMatriculas((valor) => valor + 1)
    } catch (error) {
      setErrorEstado(extraerMensajeError(error))
    } finally {
      setCambiandoEstado(false)
    }
  }

  const abrirHistorial = (documento: string, nombre: string) => {
    setHistorial({ documento, nombre, datos: null })
    setErrorHistorial(null)
    historialMatriculasEstudiante(documento)
      .then((datos) => setHistorial({ documento, nombre, datos }))
      .catch((error: unknown) => setErrorHistorial(extraerMensajeError(error)))
  }

  const manejarCrearCarga = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!anioSeleccionado) return
    if (!asignaturaNueva) {
      setErrorCreacionCarga('Debes seleccionar una materia.')
      return
    }
    if (!docenteNuevo) {
      setErrorCreacionCarga('Debes seleccionar un docente.')
      return
    }

    setCreandoCarga(true)
    setErrorCreacionCarga(null)
    try {
      await crearCarga({
        asignaturaId: Number(asignaturaNueva),
        docenteId: Number(docenteNuevo),
        gradoId,
        anio: anioSeleccionado.anio,
      })
      setAsignaturaNueva('')
      setDocenteNuevo('')
      setFormCargaAbierto(false)
      setRecargaCargas((valor) => valor + 1)
    } catch (error) {
      setErrorCreacionCarga(extraerMensajeError(error))
    } finally {
      setCreandoCarga(false)
    }
  }

  const confirmarReasignacion = async () => {
    if (!cargaAReasignar || !docenteReasignado) return

    setReasignando(true)
    setErrorReasignar(null)
    try {
      await reasignarDocenteCarga(cargaAReasignar.id, { docenteId: Number(docenteReasignado) })
      setCargaAReasignar(null)
      setDocenteReasignado('')
      setRecargaCargas((valor) => valor + 1)
    } catch (error) {
      setErrorReasignar(extraerMensajeError(error))
    } finally {
      setReasignando(false)
    }
  }

  const confirmarEliminacionCarga = async () => {
    if (!cargaAEliminar) return

    setEliminandoCarga(true)
    setErrorEliminarCarga(null)
    try {
      await eliminarCarga(cargaAEliminar.id)
      setCargaAEliminar(null)
      setRecargaCargas((valor) => valor + 1)
    } catch (error) {
      setErrorEliminarCarga(extraerMensajeError(error))
    } finally {
      setEliminandoCarga(false)
    }
  }

  if (errorGrado) {
    return (
      <>
        <Navbar titulo="Curso" />
        <main className="flex-1 p-8">
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
            {errorGrado}
          </p>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar titulo={grado?.nombre ?? 'Curso'} subtitulo="Detalle del curso" />

      <main className="flex-1 p-8">
        <Link
          to="/admin/cursos"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} />
          Volver al listado de cursos
        </Link>

        {!grado ? (
          <div className="mt-6 flex justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-3">
              <GraduationCap className="text-brand-600" size={26} />
              <h1 className="text-2xl font-bold text-slate-900">{grado.nombre}</h1>
            </div>

            {soloLectura && (
              <p className="mt-3 rounded-lg bg-accent-100 px-4 py-2 text-sm text-accent-700">
                Estás consultando un año lectivo histórico. Matricular, cambiar estados y gestionar materias están
                deshabilitados.
              </p>
            )}

            <div className="mt-6 flex gap-6 border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTabActiva(tab.id)}
                  className={cn(
                    '-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition',
                    tabActiva === tab.id
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700',
                  )}
                >
                  <tab.icono size={16} />
                  {tab.etiqueta}
                </button>
              ))}
            </div>

            {tabActiva === 'informacion' && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Información del Curso</h2>
                  <Button type="button" variant="secondary" onClick={abrirEdicionGrado}>
                    <Pencil size={16} />
                    Editar
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nombre del Curso</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{grado.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Año Lectivo</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{anioSeleccionado?.anio ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Director de Grado</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar
                        nombre={
                          nombreDirector(grado.directorId)
                            ? nombreCompleto(nombreDirector(grado.directorId)!)
                            : '?'
                        }
                        tamano="sm"
                      />
                      <p className="font-bold text-slate-900">
                        {nombreDirector(grado.directorId)
                          ? nombreCompleto(nombreDirector(grado.directorId)!)
                          : 'Sin director asignado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tabActiva === 'estudiantes' && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Estudiantes matriculados</h2>
                  <Button
                    onClick={() => setFormMatriculaAbierto(true)}
                    disabled={soloLectura}
                    title={soloLectura ? 'Año en modo consulta: no se puede matricular.' : undefined}
                  >
                    <UserPlus size={18} />
                    Matricular Estudiante
                  </Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {errorMatriculas ? (
                    <p className="p-8 text-center text-sm text-red-500">{errorMatriculas}</p>
                  ) : !matriculas ? (
                    <div className="flex justify-center py-16">
                      <Spinner />
                    </div>
                  ) : matriculas.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-400">
                      No hay estudiantes matriculados en este curso para el año {anioSeleccionado?.anio}.
                    </p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          <th className="px-6 py-3">Estudiante</th>
                          <th className="px-6 py-3">Documento</th>
                          <th className="px-6 py-3">Estado</th>
                          <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {matriculas.map((matricula) => (
                          <tr key={matricula.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar nombre={matricula.nombreCompletoEstudiante} tamano="md" />
                                <p className="font-medium text-slate-900">{matricula.nombreCompletoEstudiante}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-700">CC {matricula.documentoEstudiante}</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge color={COLOR_ESTADO[matricula.estado]}>{matricula.estado}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-3">
                                <button
                                  type="button"
                                  aria-label={`Ver historial de ${matricula.nombreCompletoEstudiante}`}
                                  onClick={() =>
                                    abrirHistorial(matricula.documentoEstudiante, matricula.nombreCompletoEstudiante)
                                  }
                                  className="cursor-pointer text-slate-500 hover:text-slate-700"
                                >
                                  <History size={16} />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Cambiar estado de ${matricula.nombreCompletoEstudiante}`}
                                  disabled={matricula.estado === 'RETIRADA' || soloLectura}
                                  onClick={() => {
                                    setMatriculaEstado(matricula)
                                    setNuevoEstado('')
                                    setErrorEstado(null)
                                  }}
                                  className="cursor-pointer text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                  <RefreshCcw size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {matriculas && (
                  <div className="mt-4 max-w-xs">
                    <TarjetaResumen
                      valor={matriculas.length}
                      etiqueta="Estudiantes"
                      descripcion={`Matriculados · ${anioSeleccionado?.anio ?? ''}`}
                      icono={ClipboardList}
                      color="accent"
                    />
                  </div>
                )}
              </div>
            )}

            {tabActiva === 'materias' && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Materias asignadas</h2>
                  <Button
                    onClick={() => setFormCargaAbierto(true)}
                    disabled={soloLectura}
                    title={soloLectura ? 'Año en modo consulta: no se pueden asignar materias.' : undefined}
                  >
                    <Plus size={18} />
                    Asignar Materia
                  </Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {errorCargas ? (
                    <p className="p-8 text-center text-sm text-red-500">{errorCargas}</p>
                  ) : !cargas ? (
                    <div className="flex justify-center py-16">
                      <Spinner />
                    </div>
                  ) : cargas.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-400">
                      No hay materias asignadas a este curso para el año {anioSeleccionado?.anio}.
                    </p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          <th className="px-6 py-3">Materia</th>
                          <th className="px-6 py-3">Docente</th>
                          <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cargas.map((carga) => (
                          <tr key={carga.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <BookMarked size={16} className="text-slate-400" />
                                <p className="font-medium text-slate-900">{carga.nombreAsignatura}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-700">{carga.nombreDocente}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-3">
                                <button
                                  type="button"
                                  aria-label={`Reasignar docente de ${carga.nombreAsignatura}`}
                                  disabled={soloLectura}
                                  onClick={() => {
                                    setCargaAReasignar(carga)
                                    setDocenteReasignado('')
                                    setErrorReasignar(null)
                                  }}
                                  className="cursor-pointer text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Eliminar ${carga.nombreAsignatura}`}
                                  disabled={soloLectura}
                                  onClick={() => setCargaAEliminar(carga)}
                                  className="cursor-pointer text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {cargas && (
                  <div className="mt-4 max-w-xs">
                    <TarjetaResumen
                      valor={cargas.length}
                      etiqueta="Materias"
                      descripcion={`Asignadas · ${anioSeleccionado?.anio ?? ''}`}
                      icono={BookMarked}
                      color="brand"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>

      {/* Modal: editar curso */}
      {formGradoAbierto && grado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Editar curso</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setFormGradoAbierto(false)
                  setErrorEdicionGrado(null)
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={manejarGuardarGrado} className="mt-4 flex flex-col gap-4">
              <Input
                label="Nombre del curso"
                value={nombreGradoEditado}
                onChange={(evento) => setNombreGradoEditado(evento.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Director de grupo</label>
                <select
                  value={directorGradoEditado}
                  onChange={(evento) => setDirectorGradoEditado(evento.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                >
                  <option value="">Director de grupo...</option>
                  {docentes.map((docente) => (
                    <option key={docente.id} value={docente.id}>
                      {nombreCompleto(docente)}
                    </option>
                  ))}
                </select>
              </div>

              {errorEdicionGrado && <p className="text-sm text-red-500">{errorEdicionGrado}</p>}

              <div className="mt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormGradoAbierto(false)
                    setErrorEdicionGrado(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={guardandoGrado}>
                  Guardar cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: matricular estudiante */}
      {formMatriculaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Matricular estudiante</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setFormMatriculaAbierto(false)
                  setErrorCreacionMatricula(null)
                  setDocumentoNuevo('')
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Curso: <span className="font-medium text-slate-700">{grado?.nombre}</span> · Año{' '}
              {anioSeleccionado?.anio}
            </p>

            <form onSubmit={manejarCrearMatricula} className="mt-4">
              <Input
                label="Documento del estudiante"
                placeholder="Número de identificación"
                value={documentoNuevo}
                onChange={(evento) => setDocumentoNuevo(evento.target.value)}
              />
              {errorCreacionMatricula && <p className="mt-2 text-sm text-red-500">{errorCreacionMatricula}</p>}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormMatriculaAbierto(false)
                    setErrorCreacionMatricula(null)
                    setDocumentoNuevo('')
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={creandoMatricula}>
                  Matricular
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: cambiar estado de matrícula */}
      {matriculaEstado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Cambiar estado</h2>
            <p className="mt-2 text-sm text-slate-500">
              {matriculaEstado.nombreCompletoEstudiante} · Estado actual:{' '}
              <Badge color={COLOR_ESTADO[matriculaEstado.estado]}>{matriculaEstado.estado}</Badge>
            </p>

            <div className="mt-4">
              <select
                value={nuevoEstado}
                onChange={(evento) => setNuevoEstado(evento.target.value as EstadoMatricula)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">Nuevo estado...</option>
                {ESTADOS.filter((estado) => estado !== matriculaEstado.estado).map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {errorEstado && <p className="mt-2 text-sm text-red-500">{errorEstado}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setMatriculaEstado(null)
                  setErrorEstado(null)
                }}
              >
                Cancelar
              </Button>
              <Button type="button" isLoading={cambiandoEstado} disabled={!nuevoEstado} onClick={confirmarCambioEstado}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: historial de matrículas del estudiante */}
      {historial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Historial de {historial.nombre}</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setHistorial(null)
                  setErrorHistorial(null)
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              {errorHistorial ? (
                <p className="text-sm text-red-500">{errorHistorial}</p>
              ) : !historial.datos ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : historial.datos.length === 0 ? (
                <p className="text-sm text-slate-400">Sin matrículas registradas.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {historial.datos.map((matricula) => (
                    <li key={matricula.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{matricula.nombreGrado}</p>
                        <p className="text-xs text-slate-400">Año {matricula.anioLectivo}</p>
                      </div>
                      <Badge color={COLOR_ESTADO[matricula.estado]}>{matricula.estado}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: asignar materia (carga académica) */}
      {formCargaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Asignar materia</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setFormCargaAbierto(false)
                  setErrorCreacionCarga(null)
                  setAsignaturaNueva('')
                  setDocenteNuevo('')
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Curso: <span className="font-medium text-slate-700">{grado?.nombre}</span> · Año{' '}
              {anioSeleccionado?.anio}
            </p>

            <form onSubmit={manejarCrearCarga} className="mt-4 flex flex-col gap-4">
              <select
                value={asignaturaNueva}
                onChange={(evento) => setAsignaturaNueva(evento.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">Materia...</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura.id} value={asignatura.id}>
                    {asignatura.nombre}
                  </option>
                ))}
              </select>

              <select
                value={docenteNuevo}
                onChange={(evento) => setDocenteNuevo(evento.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">Docente...</option>
                {docentes.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {nombreCompleto(docente)}
                  </option>
                ))}
              </select>

              {errorCreacionCarga && <p className="text-sm text-red-500">{errorCreacionCarga}</p>}

              <div className="mt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormCargaAbierto(false)
                    setErrorCreacionCarga(null)
                    setAsignaturaNueva('')
                    setDocenteNuevo('')
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={creandoCarga}>
                  Asignar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: reasignar docente de una carga */}
      {cargaAReasignar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Reasignar docente</h2>
            <p className="mt-2 text-sm text-slate-500">
              {cargaAReasignar.nombreAsignatura} · Docente actual:{' '}
              <span className="font-medium text-slate-700">{cargaAReasignar.nombreDocente}</span>
            </p>

            <div className="mt-4">
              <select
                value={docenteReasignado}
                onChange={(evento) => setDocenteReasignado(evento.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">Nuevo docente...</option>
                {docentes
                  .filter((docente) => docente.id !== cargaAReasignar.docenteId)
                  .map((docente) => (
                    <option key={docente.id} value={docente.id}>
                      {nombreCompleto(docente)}
                    </option>
                  ))}
              </select>
            </div>

            {errorReasignar && <p className="mt-2 text-sm text-red-500">{errorReasignar}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCargaAReasignar(null)
                  setErrorReasignar(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                isLoading={reasignando}
                disabled={!docenteReasignado}
                onClick={confirmarReasignacion}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      <DialogoConfirmacion
        abierto={Boolean(cargaAEliminar)}
        titulo="Eliminar materia asignada"
        mensaje={
          cargaAEliminar
            ? `¿Seguro que deseas eliminar "${cargaAEliminar.nombreAsignatura}" (${cargaAEliminar.nombreDocente}) de este curso? Esta acción no se puede deshacer. Si tiene notas registradas, la eliminación fallará.`
            : ''
        }
        error={errorEliminarCarga ?? undefined}
        procesando={eliminandoCarga}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacionCarga}
        onCancelar={() => {
          setCargaAEliminar(null)
          setErrorEliminarCarga(null)
        }}
      />
    </>
  )
}
