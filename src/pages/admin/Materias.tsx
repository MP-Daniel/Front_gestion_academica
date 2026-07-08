import { useEffect, useState, type FormEvent } from 'react'
import { BookMarked, Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { actualizarAsignatura, crearAsignatura, eliminarAsignatura, listarAsignaturas } from '@/api/academico.api'
import { extraerMensajeError } from '@/api/axios'
import type { Asignatura } from '@/types/academico.types'

export default function Materias() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [nombreNuevo, setNombreNuevo] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null)

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null)

  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState<Asignatura | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    listarAsignaturas()
      .then((datos) => {
        if (vigente) setAsignaturas(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  const manejarCrear = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!nombreNuevo.trim()) return

    setCreando(true)
    setErrorCreacion(null)
    try {
      const creada = await crearAsignatura({ nombre: nombreNuevo.trim() })
      setAsignaturas((actual) => [...(actual ?? []), creada])
      setNombreNuevo('')
    } catch (error) {
      setErrorCreacion(extraerMensajeError(error))
    } finally {
      setCreando(false)
    }
  }

  const iniciarEdicion = (asignatura: Asignatura) => {
    setEditandoId(asignatura.id)
    setNombreEditado(asignatura.nombre)
    setErrorEdicion(null)
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setNombreEditado('')
  }

  const guardarEdicion = async () => {
    if (editandoId === null || !nombreEditado.trim()) return

    setGuardandoEdicion(true)
    setErrorEdicion(null)
    try {
      const actualizada = await actualizarAsignatura(editandoId, { nombre: nombreEditado.trim() })
      setAsignaturas((actual) => actual?.map((a) => (a.id === actualizada.id ? actualizada : a)) ?? null)
      setEditandoId(null)
    } catch (error) {
      setErrorEdicion(extraerMensajeError(error))
    } finally {
      setGuardandoEdicion(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!asignaturaAEliminar) return

    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminarAsignatura(asignaturaAEliminar.id)
      setAsignaturas((actual) => actual?.filter((a) => a.id !== asignaturaAEliminar.id) ?? null)
      setAsignaturaAEliminar(null)
    } catch (error) {
      setErrorEliminar(extraerMensajeError(error))
    } finally {
      setEliminando(false)
    }
  }

  return (
    <>
      <Navbar titulo="Materias" subtitulo="Catálogo académico de asignaturas" anioActivo={2027} />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Gestionar Materias</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra el catálogo de asignaturas del sistema. Cada materia se asigna a los docentes por
          separado.
        </p>

        <form
          onSubmit={manejarCrear}
          className="mt-6 flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex-1">
            <Input
              placeholder="Nombre de la nueva materia"
              value={nombreNuevo}
              onChange={(evento) => setNombreNuevo(evento.target.value)}
              error={errorCreacion ?? undefined}
            />
          </div>
          <div className="shrink-0">
            <Button type="submit" isLoading={creando}>
              <Plus size={18} />
              Agregar
            </Button>
          </div>
        </form>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <p className="p-8 text-center text-sm text-red-500">{error}</p>
          ) : !asignaturas ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : asignaturas.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No hay materias registradas.</p>
          ) : (
            <ul>
              {asignaturas.map((asignatura) => (
                <li
                  key={asignatura.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-3 last:border-0"
                >
                  {editandoId === asignatura.id ? (
                    <input
                      autoFocus
                      value={nombreEditado}
                      onChange={(evento) => setNombreEditado(evento.target.value)}
                      onKeyDown={(evento) => {
                        if (evento.key === 'Enter') guardarEdicion()
                        if (evento.key === 'Escape') cancelarEdicion()
                      }}
                      className="flex-1 rounded-lg border border-brand-300 px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <BookMarked size={16} className="text-slate-400" />
                      <p className="text-sm font-medium text-slate-900">{asignatura.nombre}</p>
                    </div>
                  )}

                  <div className="flex shrink-0 items-center gap-3">
                    {editandoId === asignatura.id ? (
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
                          aria-label={`Editar ${asignatura.nombre}`}
                          onClick={() => iniciarEdicion(asignatura)}
                          className="cursor-pointer text-blue-600 hover:text-blue-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Eliminar ${asignatura.nombre}`}
                          onClick={() => setAsignaturaAEliminar(asignatura)}
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

        {editandoId !== null && errorEdicion && (
          <p className="mt-2 text-sm text-red-500">{errorEdicion}</p>
        )}

        <div className="mt-8 max-w-xs">
          <TarjetaResumen
            valor={asignaturas?.length ?? 0}
            etiqueta="Materias"
            descripcion="Registradas en el catálogo"
            icono={BookMarked}
            color="accent"
          />
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>

      <DialogoConfirmacion
        abierto={Boolean(asignaturaAEliminar)}
        titulo="Eliminar materia"
        mensaje={
          asignaturaAEliminar
            ? `¿Seguro que deseas eliminar "${asignaturaAEliminar.nombre}"? Esta acción no se puede deshacer. Si la materia tiene cargas académicas asociadas, la eliminación fallará.`
            : ''
        }
        procesando={eliminando}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAsignaturaAEliminar(null)}
      />

      {errorEliminar && (
        <p className="fixed bottom-4 right-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 shadow-md">
          {errorEliminar}
        </p>
      )}
    </>
  )
}
