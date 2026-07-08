import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, GraduationCap, Pencil, Plus, Trash2, User, Users, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { actualizarGrado, crearGrado, eliminarGrado, listarGrados } from '@/api/academico.api'
import { listarDocentes } from '@/api/docentes.api'
import { extraerMensajeError } from '@/api/axios'
import { cn, nombreCompleto } from '@/lib/utils'
import type { Grado } from '@/types/academico.types'
import type { Docente } from '@/types/docente.types'

const BARRAS_COLOR = ['bg-brand-500', 'bg-blue-500', 'bg-amber-400', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500']

function colorPorNombre(nombre: string) {
  const hash = [...nombre].reduce((acumulado, caracter) => acumulado + caracter.charCodeAt(0), 0)
  return BARRAS_COLOR[hash % BARRAS_COLOR.length]
}

export default function Cursos() {
  const navigate = useNavigate()
  const [grados, setGrados] = useState<Grado[] | null>(null)
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [error, setError] = useState<string | null>(null)

  const [nombreNuevo, setNombreNuevo] = useState('')
  const [directorNuevo, setDirectorNuevo] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null)

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [directorEditado, setDirectorEditado] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null)

  const [gradoAEliminar, setGradoAEliminar] = useState<Grado | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    Promise.all([listarGrados(), listarDocentes({ tamanoPagina: 100, incluirInactivos: false })])
      .then(([datosGrados, paginaDocentes]) => {
        if (!vigente) return
        setGrados(datosGrados)
        setDocentes(paginaDocentes.content)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  const nombreDirector = (directorId: number | null) => {
    if (directorId === null) return null
    return docentes.find((d) => d.id === directorId)
  }

  const manejarCrear = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!nombreNuevo.trim()) {
      setErrorCreacion('El nombre del curso es obligatorio.')
      return
    }
    if (!directorNuevo) {
      setErrorCreacion('Debes seleccionar un director de grupo.')
      return
    }

    setCreando(true)
    setErrorCreacion(null)
    try {
      const creado = await crearGrado({ nombre: nombreNuevo.trim(), directorId: Number(directorNuevo) })
      setGrados((actual) => [...(actual ?? []), creado])
      setNombreNuevo('')
      setDirectorNuevo('')
    } catch (error) {
      setErrorCreacion(extraerMensajeError(error))
    } finally {
      setCreando(false)
    }
  }

  const iniciarEdicion = (grado: Grado) => {
    setEditandoId(grado.id)
    setNombreEditado(grado.nombre)
    setDirectorEditado(grado.directorId ? String(grado.directorId) : '')
    setErrorEdicion(null)
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setNombreEditado('')
    setDirectorEditado('')
  }

  const guardarEdicion = async () => {
    if (editandoId === null) return
    if (!nombreEditado.trim()) {
      setErrorEdicion('El nombre del curso es obligatorio.')
      return
    }
    if (!directorEditado) {
      setErrorEdicion('Debes seleccionar un director de grupo.')
      return
    }

    setGuardandoEdicion(true)
    setErrorEdicion(null)
    try {
      const actualizado = await actualizarGrado(editandoId, {
        nombre: nombreEditado.trim(),
        directorId: Number(directorEditado),
      })
      setGrados((actual) => actual?.map((g) => (g.id === actualizado.id ? actualizado : g)) ?? null)
      setEditandoId(null)
    } catch (error) {
      setErrorEdicion(extraerMensajeError(error))
    } finally {
      setGuardandoEdicion(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!gradoAEliminar) return

    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminarGrado(gradoAEliminar.id)
      setGrados((actual) => actual?.filter((g) => g.id !== gradoAEliminar.id) ?? null)
      setGradoAEliminar(null)
    } catch (error) {
      setErrorEliminar(extraerMensajeError(error))
    } finally {
      setEliminando(false)
    }
  }

  const sinDirector = grados?.filter((g) => g.directorId === null).length ?? 0

  return (
    <>
      <Navbar titulo="Cursos" subtitulo="Catálogo de grados escolares" />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Gestionar Cursos</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra los grados del sistema y su director de grupo. Ingresa al detalle de un curso para
          gestionar sus estudiantes matriculados y las materias asignadas.
        </p>

        <form
          onSubmit={manejarCrear}
          className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Input
                placeholder="Nombre del nuevo curso"
                value={nombreNuevo}
                onChange={(evento) => setNombreNuevo(evento.target.value)}
              />
            </div>
            <div className="flex-1">
              <select
                value={directorNuevo}
                onChange={(evento) => setDirectorNuevo(evento.target.value)}
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
            <div className="shrink-0">
              <Button type="submit" isLoading={creando}>
                <Plus size={18} />
                Agregar
              </Button>
            </div>
          </div>
          {errorCreacion && <p className="mt-3 text-sm text-red-500">{errorCreacion}</p>}
        </form>

        <div className="mt-6">
          {error ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
              {error}
            </p>
          ) : !grados ? (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner />
            </div>
          ) : grados.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No hay cursos registrados.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grados.map((grado) => {
                const estaEditando = editandoId === grado.id

                return (
                  <div
                    key={grado.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className={cn('h-1.5', colorPorNombre(grado.nombre))} />
                    <div className="p-5">
                      {estaEditando ? (
                        <div className="flex flex-col gap-3">
                          <input
                            autoFocus
                            value={nombreEditado}
                            onChange={(evento) => setNombreEditado(evento.target.value)}
                            onKeyDown={(evento) => {
                              if (evento.key === 'Escape') cancelarEdicion()
                            }}
                            className="w-full rounded-lg border border-brand-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                          />
                          <select
                            value={directorEditado}
                            onChange={(evento) => setDirectorEditado(evento.target.value)}
                            className="w-full rounded-lg border border-brand-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                          >
                            <option value="">Director de grupo...</option>
                            {docentes.map((docente) => (
                              <option key={docente.id} value={docente.id}>
                                {nombreCompleto(docente)}
                              </option>
                            ))}
                          </select>
                          {errorEdicion && <p className="text-xs text-red-500">{errorEdicion}</p>}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Guardar"
                              onClick={guardarEdicion}
                              disabled={guardandoEdicion}
                              className="cursor-pointer text-brand-600 hover:text-brand-700 disabled:opacity-50"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Cancelar edición"
                              onClick={cancelarEdicion}
                              className="cursor-pointer text-slate-400 hover:text-slate-600"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <GraduationCap size={18} className="text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-900">{grado.nombre}</h3>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                            <User size={14} className="shrink-0" />
                            <span>
                              Director:{' '}
                              <span className="font-medium text-slate-700">
                                {nombreDirector(grado.directorId)
                                  ? nombreCompleto(nombreDirector(grado.directorId)!)
                                  : 'Sin director asignado'}
                              </span>
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                            <Users size={14} className="shrink-0" />
                            <span>
                              Estudiantes: <span className="italic">en desarrollo</span>
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <button
                              type="button"
                              aria-label={`Editar ${grado.nombre}`}
                              onClick={() => iniciarEdicion(grado)}
                              className="cursor-pointer text-blue-600 hover:text-blue-700"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Eliminar ${grado.nombre}`}
                              onClick={() => setGradoAEliminar(grado)}
                              className="cursor-pointer text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="flex-1">
                              <Button onClick={() => navigate(`/admin/cursos/${grado.id}`)}>Administrar</Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4">
          <TarjetaResumen
            valor={grados?.length ?? 0}
            etiqueta="Cursos"
            descripcion="Registrados en el catálogo"
            icono={GraduationCap}
            color="accent"
          />
          <TarjetaResumen
            valor={sinDirector}
            etiqueta="Cursos"
            descripcion="Sin director asignado"
            icono={GraduationCap}
            color="brand"
          />
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>

      <DialogoConfirmacion
        abierto={Boolean(gradoAEliminar)}
        titulo="Eliminar curso"
        mensaje={
          gradoAEliminar
            ? `¿Seguro que deseas eliminar "${gradoAEliminar.nombre}"? Esta acción no se puede deshacer. Si el curso tiene matrículas o cargas académicas asociadas, la eliminación fallará.`
            : ''
        }
        error={errorEliminar ?? undefined}
        procesando={eliminando}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => {
          setGradoAEliminar(null)
          setErrorEliminar(null)
        }}
      />
    </>
  )
}
