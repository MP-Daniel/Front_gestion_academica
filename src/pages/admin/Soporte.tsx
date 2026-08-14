import { useEffect, useState, type FormEvent } from 'react'
import { Trash2, Wrench, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import {
  actualizarEstadoSolicitudSoporte,
  eliminarSolicitudSoporte,
  listarTodasLasSolicitudesSoporte,
} from '@/api/soporte.api'
import { extraerMensajeError } from '@/api/axios'
import { formatearFechaHora } from '@/lib/utils'
import { COLOR_CATEGORIA, COLOR_ESTADO, ETIQUETA_CATEGORIA, ETIQUETA_ESTADO } from '@/lib/soporte'
import type { EstadoSolicitudSoporte, SolicitudSoporte } from '@/types/soporte.types'

const CLASE_CAMPO =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'

const FILTROS_ESTADO: Array<{ valor: EstadoSolicitudSoporte | 'TODAS'; etiqueta: string }> = [
  { valor: 'TODAS', etiqueta: 'Todas' },
  { valor: 'ABIERTA', etiqueta: 'Abiertas' },
  { valor: 'EN_PROCESO', etiqueta: 'En proceso' },
  { valor: 'RESUELTA', etiqueta: 'Resueltas' },
]

export default function Soporte() {
  const [solicitudes, setSolicitudes] = useState<SolicitudSoporte[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recarga, setRecarga] = useState(0)
  const [filtro, setFiltro] = useState<EstadoSolicitudSoporte | 'TODAS'>('TODAS')

  const [solicitudAGestionar, setSolicitudAGestionar] = useState<SolicitudSoporte | null>(null)
  const [formulario, setFormulario] = useState<{ estado: EstadoSolicitudSoporte; respuestaAdmin: string }>({
    estado: 'ABIERTA',
    respuestaAdmin: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null)

  const [solicitudAEliminar, setSolicitudAEliminar] = useState<SolicitudSoporte | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    setError(null)

    listarTodasLasSolicitudesSoporte()
      .then((datos) => {
        if (vigente) setSolicitudes(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [recarga])

  const abrirGestion = (solicitud: SolicitudSoporte) => {
    setSolicitudAGestionar(solicitud)
    setFormulario({ estado: solicitud.estado, respuestaAdmin: solicitud.respuestaAdmin ?? '' })
    setErrorGuardar(null)
  }

  const guardarGestion = async (e: FormEvent) => {
    e.preventDefault()
    if (!solicitudAGestionar) return

    setGuardando(true)
    setErrorGuardar(null)
    try {
      await actualizarEstadoSolicitudSoporte(solicitudAGestionar.id, {
        estado: formulario.estado,
        respuestaAdmin: formulario.respuestaAdmin.trim() || undefined,
      })
      setSolicitudAGestionar(null)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorGuardar(extraerMensajeError(error))
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminacion = async () => {
    if (!solicitudAEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminarSolicitudSoporte(solicitudAEliminar.id)
      setSolicitudAEliminar(null)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorEliminar(extraerMensajeError(error))
    } finally {
      setEliminando(false)
    }
  }

  const solicitudesFiltradas = (solicitudes ?? []).filter(
    (solicitud) => filtro === 'TODAS' || solicitud.estado === filtro,
  )

  return (
    <>
      <Navbar titulo="Soporte" subtitulo="Solicitudes creadas por docentes, estudiantes y administradores" />

      <main className="flex-1 p-8">
        <div className="flex flex-wrap gap-2">
          {FILTROS_ESTADO.map(({ valor, etiqueta }) => (
            <button
              key={valor}
              type="button"
              onClick={() => setFiltro(valor)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filtro === valor
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {etiqueta}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <p className="p-8 text-center text-sm text-red-500">{error}</p>
          ) : !solicitudes ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : solicitudesFiltradas.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No hay solicitudes con este filtro.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    <th className="px-6 py-3 whitespace-nowrap">Solicitante</th>
                    <th className="px-6 py-3 whitespace-nowrap">Asunto</th>
                    <th className="px-6 py-3 whitespace-nowrap">Categoría</th>
                    <th className="px-6 py-3 whitespace-nowrap">Estado</th>
                    <th className="px-6 py-3 whitespace-nowrap">Fecha</th>
                    <th className="px-6 py-3 text-right whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-slate-900">{solicitud.nombreSolicitante}</p>
                        <p className="text-xs text-slate-400">
                          {solicitud.rolSolicitante} · {solicitud.documentoSolicitante}
                        </p>
                      </td>
                      <td className="max-w-xs px-6 py-4">
                        <p className="truncate text-slate-700">{solicitud.asunto}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={COLOR_CATEGORIA[solicitud.categoria]}>
                          {ETIQUETA_CATEGORIA[solicitud.categoria]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={COLOR_ESTADO[solicitud.estado]}>{ETIQUETA_ESTADO[solicitud.estado]}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {formatearFechaHora(solicitud.fechaCreacion)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            aria-label={`Gestionar solicitud de ${solicitud.nombreSolicitante}`}
                            title="Gestionar"
                            onClick={() => abrirGestion(solicitud)}
                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                          >
                            <Wrench size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar solicitud de ${solicitud.nombreSolicitante}`}
                            title="Eliminar"
                            onClick={() => setSolicitudAEliminar(solicitud)}
                            className="cursor-pointer text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>

      {solicitudAGestionar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
              <div className="min-w-0">
                <h2 className="text-lg font-bold break-words text-slate-900">{solicitudAGestionar.asunto}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {solicitudAGestionar.nombreSolicitante} · {solicitudAGestionar.rolSolicitante}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSolicitudAGestionar(null)}
                className="shrink-0 cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form
              id="form-gestion-soporte"
              onSubmit={guardarGestion}
              className="flex flex-col gap-4 overflow-y-auto p-6"
            >
              <p className="rounded-lg bg-slate-50 p-3 text-sm break-words text-slate-600">
                {solicitudAGestionar.descripcion}
              </p>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Estado</label>
                <select
                  className={CLASE_CAMPO}
                  value={formulario.estado}
                  onChange={(e) =>
                    setFormulario({ ...formulario, estado: e.target.value as EstadoSolicitudSoporte })
                  }
                >
                  {(Object.entries(ETIQUETA_ESTADO) as [EstadoSolicitudSoporte, string][]).map(
                    ([valor, etiqueta]) => (
                      <option key={valor} value={valor}>
                        {etiqueta}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Respuesta <span className="font-normal text-slate-400">(opcional, visible para el solicitante)</span>
                </label>
                <textarea
                  className={CLASE_CAMPO}
                  rows={3}
                  placeholder="Ej. Ya se corrigió, por favor vuelve a intentarlo."
                  value={formulario.respuestaAdmin}
                  onChange={(e) => setFormulario({ ...formulario, respuestaAdmin: e.target.value })}
                  maxLength={1000}
                />
              </div>

              {errorGuardar && <p className="text-sm text-red-500">{errorGuardar}</p>}
            </form>

            <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
              <Button type="button" variant="secondary" onClick={() => setSolicitudAGestionar(null)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-gestion-soporte" isLoading={guardando}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      <DialogoConfirmacion
        abierto={Boolean(solicitudAEliminar)}
        titulo="Eliminar solicitud"
        mensaje={
          solicitudAEliminar
            ? `¿Seguro que deseas eliminar la solicitud "${solicitudAEliminar.asunto}"? Esta acción no se puede deshacer.`
            : ''
        }
        error={errorEliminar ?? undefined}
        procesando={eliminando}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => {
          setSolicitudAEliminar(null)
          setErrorEliminar(null)
        }}
      />
    </>
  )
}
