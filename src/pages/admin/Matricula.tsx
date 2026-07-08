import { useEffect, useState, type FormEvent } from 'react'
import { ClipboardList, History, RefreshCcw, UserPlus, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { listarGrados } from '@/api/academico.api'
import {
  cambiarEstadoMatricula,
  crearMatricula,
  historialMatriculasEstudiante,
  listarMatriculasPorGrado,
} from '@/api/matriculas.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import type { Grado } from '@/types/academico.types'
import type { EstadoMatricula, Matricula } from '@/types/matricula.types'

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

const ESTADOS: EstadoMatricula[] = ['ACTIVA', 'PROMOVIDA', 'REPROBADA', 'RETIRADA']

export default function Matricula() {
  const { anioSeleccionado, soloLectura } = useAnioLectivo()

  const [grados, setGrados] = useState<Grado[] | null>(null)
  const [errorGrados, setErrorGrados] = useState<string | null>(null)
  const [gradoId, setGradoId] = useState<number | null>(null)

  const [matriculas, setMatriculas] = useState<Matricula[] | null>(null)
  const [errorMatriculas, setErrorMatriculas] = useState<string | null>(null)
  const [recarga, setRecarga] = useState(0)

  const [formAbierto, setFormAbierto] = useState(false)
  const [documentoNuevo, setDocumentoNuevo] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null)

  const [matriculaEstado, setMatriculaEstado] = useState<Matricula | null>(null)
  const [nuevoEstado, setNuevoEstado] = useState<EstadoMatricula | ''>('')
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [errorEstado, setErrorEstado] = useState<string | null>(null)

  const [historial, setHistorial] = useState<{ documento: string; nombre: string; datos: Matricula[] | null } | null>(
    null,
  )
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    listarGrados()
      .then((datos) => {
        if (vigente) setGrados(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorGrados(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  useEffect(() => {
    if (!gradoId || !anioSeleccionado) {
      setMatriculas(null)
      return
    }

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
  }, [gradoId, anioSeleccionado, recarga])

  const gradoSeleccionado = grados?.find((g) => g.id === gradoId) ?? null

  const manejarCrear = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!gradoId || !anioSeleccionado) return
    if (!documentoNuevo.trim()) {
      setErrorCreacion('El documento del estudiante es obligatorio.')
      return
    }

    setCreando(true)
    setErrorCreacion(null)
    try {
      await crearMatricula({
        documentoEstudiante: documentoNuevo.trim(),
        gradoId,
        anio: anioSeleccionado.anio,
      })
      setDocumentoNuevo('')
      setFormAbierto(false)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorCreacion(extraerMensajeError(error))
    } finally {
      setCreando(false)
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
      setRecarga((valor) => valor + 1)
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

  return (
    <>
      <Navbar titulo="Matrícula" subtitulo="Estudiantes matriculados por curso" />

      <main className="flex-1 p-8">
        <div className="flex items-start gap-4">
          <div className="w-72">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Curso</label>
            <select
              value={gradoId ?? ''}
              onChange={(evento) => setGradoId(evento.target.value ? Number(evento.target.value) : null)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
            >
              <option value="">Selecciona un curso...</option>
              {grados?.map((grado) => (
                <option key={grado.id} value={grado.id}>
                  {grado.nombre}
                </option>
              ))}
            </select>
            {errorGrados && <p className="mt-1 text-xs text-red-500">{errorGrados}</p>}
          </div>

          <div className="flex-1" />

          <div className="shrink-0 pt-6">
            <Button
              onClick={() => setFormAbierto(true)}
              disabled={!gradoId || soloLectura}
              title={soloLectura ? 'Año en modo consulta: no se puede matricular.' : undefined}
            >
              <UserPlus size={18} />
              Matricular Estudiante
            </Button>
          </div>
        </div>

        {soloLectura && (
          <p className="mt-3 rounded-lg bg-accent-100 px-4 py-2 text-sm text-accent-700">
            Estás consultando un año lectivo histórico. La matrícula y el cambio de estado están deshabilitados.
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {!gradoId ? (
            <div className="flex flex-col items-center gap-2 p-16 text-center">
              <ClipboardList size={28} className="text-slate-300" />
              <p className="text-sm text-slate-400">Selecciona un curso para ver los estudiantes matriculados.</p>
            </div>
          ) : errorMatriculas ? (
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
                          onClick={() => abrirHistorial(matricula.documentoEstudiante, matricula.nombreCompletoEstudiante)}
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

        {gradoId && matriculas && (
          <div className="mt-8 max-w-xs">
            <TarjetaResumen
              valor={matriculas.length}
              etiqueta="Estudiantes"
              descripcion={`Matriculados en ${gradoSeleccionado?.nombre ?? 'este curso'} · ${anioSeleccionado?.anio ?? ''}`}
              icono={ClipboardList}
              color="accent"
            />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>

      {formAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Matricular estudiante</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setFormAbierto(false)
                  setErrorCreacion(null)
                  setDocumentoNuevo('')
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Curso: <span className="font-medium text-slate-700">{gradoSeleccionado?.nombre}</span> · Año{' '}
              {anioSeleccionado?.anio}
            </p>

            <form onSubmit={manejarCrear} className="mt-4">
              <Input
                label="Documento del estudiante"
                placeholder="Número de identificación"
                value={documentoNuevo}
                onChange={(evento) => setDocumentoNuevo(evento.target.value)}
              />
              {errorCreacion && <p className="mt-2 text-sm text-red-500">{errorCreacion}</p>}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormAbierto(false)
                    setErrorCreacion(null)
                    setDocumentoNuevo('')
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={creando}>
                  Matricular
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </>
  )
}
