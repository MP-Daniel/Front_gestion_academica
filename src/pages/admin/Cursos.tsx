import { useEffect, useState, type FormEvent } from 'react'
import { Check, GraduationCap, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { actualizarGrado, crearGrado, eliminarGrado, listarGrados } from '@/api/academico.api'
import { listarDocentes } from '@/api/docentes.api'
import { extraerMensajeError } from '@/api/axios'
import { nombreCompleto } from '@/lib/utils'
import type { Grado } from '@/types/academico.types'
import type { Docente } from '@/types/docente.types'

export default function Cursos() {
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
          Administra los grados del sistema y su director de grupo. La matrícula de estudiantes se
          gestiona por separado.
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

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <p className="p-8 text-center text-sm text-red-500">{error}</p>
          ) : !grados ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : grados.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No hay cursos registrados.</p>
          ) : (
            <ul>
              {grados.map((grado) => (
                <li
                  key={grado.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-3 last:border-0"
                >
                  {editandoId === grado.id ? (
                    <div className="flex flex-1 items-center gap-3">
                      <input
                        autoFocus
                        value={nombreEditado}
                        onChange={(evento) => setNombreEditado(evento.target.value)}
                        onKeyDown={(evento) => {
                          if (evento.key === 'Escape') cancelarEdicion()
                        }}
                        className="flex-1 rounded-lg border border-brand-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                      />
                      <select
                        value={directorEditado}
                        onChange={(evento) => setDirectorEditado(evento.target.value)}
                        className="flex-1 rounded-lg border border-brand-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                      >
                        <option value="">Director de grupo...</option>
                        {docentes.map((docente) => (
                          <option key={docente.id} value={docente.id}>
                            {nombreCompleto(docente)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-slate-400" />
                      <p className="text-sm font-medium text-slate-900">{grado.nombre}</p>
                      <span className="text-sm text-slate-400">
                        — {nombreDirector(grado.directorId) ? nombreCompleto(nombreDirector(grado.directorId)!) : 'Sin director asignado'}
                      </span>
                    </div>
                  )}

                  <div className="flex shrink-0 items-center gap-3">
                    {editandoId === grado.id ? (
                      <>
                        <button
                          type="button"
                          aria-label="Guardar"
                          onClick={guardarEdicion}
                          disabled={guardandoEdicion}
                          className="cursor-pointer text-brand-600 hover:text-brand-700 disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label="Cancelar edición"
                          onClick={cancelarEdicion}
                          className="cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {editandoId !== null && errorEdicion && <p className="mt-2 text-sm text-red-500">{errorEdicion}</p>}

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
