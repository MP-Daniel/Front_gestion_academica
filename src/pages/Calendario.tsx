import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { listarEventos, crearEvento, eliminarEvento } from '@/api/eventos.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { Navbar } from '@/components/layout/Navbar'
import { NavbarEstudiante } from '@/components/layout/NavbarEstudiante'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { formatearFechaCorta } from '@/lib/utils'
import type { EventoInstitucional } from '@/types/eventos.types'

export default function Calendario() {
  const { usuario } = useAuth()
  const [eventos, setEventos] = useState<EventoInstitucional[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recarga, setRecarga] = useState(0)

  // Estados de Creación
  const [modalAbierto, setModalAbierto] = useState(false)
  const [formulario, setFormulario] = useState({ titulo: '', descripcion: '', fecha: '', lugar: '' })
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null)

  // Estados de Eliminación
  const [eventoAEliminar, setEventoAEliminar] = useState<EventoInstitucional | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    setError(null)

    listarEventos()
      .then((datos) => {
        if (vigente) setEventos(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [recarga])

  const manejarCrear = async (e: FormEvent) => {
    e.preventDefault()
    if (!formulario.titulo.trim() || !formulario.descripcion.trim() || !formulario.fecha) {
      setErrorCreacion('Título, descripción y fecha son obligatorios.')
      return
    }

    setCreando(true)
    setErrorCreacion(null)
    try {
      await crearEvento({
        titulo: formulario.titulo.trim(),
        descripcion: formulario.descripcion.trim(),
        fecha: formulario.fecha,
        lugar: formulario.lugar.trim() || null,
      })
      setModalAbierto(false)
      setFormulario({ titulo: '', descripcion: '', fecha: '', lugar: '' })
      setRecarga((r) => r + 1)
    } catch (error) {
      setErrorCreacion(extraerMensajeError(error))
    } finally {
      setCreando(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!eventoAEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminarEvento(eventoAEliminar.id)
      setEventoAEliminar(null)
      setRecarga((r) => r + 1)
    } catch (error) {
      setErrorEliminar(extraerMensajeError(error))
    } finally {
      setEliminando(false)
    }
  }

  if (!usuario) return null

  const esAdministrador = usuario.rol === 'ADMIN'

  return (
    <>
      {esAdministrador ? (
        <Navbar
          titulo="Calendario Institucional"
          subtitulo="Eventos y actividades programadas por la institución"
        />
      ) : (
        <NavbarEstudiante usuario={usuario} seccionActual="Calendario" />
      )}

      <main className="flex-1 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Calendario Institucional</h2>
            <p className="mt-1 text-sm text-slate-500">Todos los eventos programados por la institución.</p>
          </div>
          {esAdministrador && (
            <Button onClick={() => setModalAbierto(true)}>
              <Plus size={18} />
              Nuevo evento
            </Button>
          )}
        </div>

        <div className="mt-6">
          {error ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
              {error}
            </p>
          ) : !eventos ? (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner />
            </div>
          ) : eventos.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No hay eventos institucionales registrados.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {eventos.map((evento) => {
                const { dia, mes } = formatearFechaCorta(evento.fecha)
                return (
                  <li
                    key={evento.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-brand-50 py-2 text-brand-700">
                      <span className="text-xl leading-none font-bold">{dia}</span>
                      <span className="text-xs leading-none font-semibold">{mes}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{evento.titulo}</p>
                      <p className="text-sm text-slate-500">{evento.descripcion}</p>
                    </div>
                    {evento.lugar && (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        {evento.lugar}
                      </span>
                    )}
                    {esAdministrador && (
                      <button
                        type="button"
                        aria-label={`Eliminar ${evento.titulo}`}
                        onClick={() => setEventoAEliminar(evento)}
                        className="ml-2 cursor-pointer text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>

      {/* Modal de Creación */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Crear Evento Institucional</h2>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={manejarCrear} className="mt-6 flex flex-col gap-4">
              <Input
                label="Título del evento *"
                placeholder="Ej. Entrega de Informes"
                value={formulario.titulo}
                onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
                maxLength={150}
              />
              <Input
                label="Descripción *"
                placeholder="Ej. Segundo Periodo Académico"
                value={formulario.descripcion}
                onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                maxLength={255}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Fecha *"
                  type="date"
                  value={formulario.fecha}
                  onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
                />
                <Input
                  label="Lugar"
                  placeholder="Ej. Auditorio Principal"
                  value={formulario.lugar}
                  onChange={(e) => setFormulario({ ...formulario, lugar: e.target.value })}
                  maxLength={150}
                />
              </div>

              {errorCreacion && <p className="text-sm text-red-500">{errorCreacion}</p>}

              <div className="mt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={creando}>
                  Crear Evento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmar Eliminación */}
      <DialogoConfirmacion
        abierto={Boolean(eventoAEliminar)}
        titulo="Eliminar evento"
        mensaje={`¿Estás seguro de que deseas eliminar el evento "${eventoAEliminar?.titulo}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        procesando={eliminando}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setEventoAEliminar(null)}
      />
      {errorEliminar && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600 shadow-lg border border-red-200">
          {errorEliminar}
        </div>
      )}
    </>
  )
}
