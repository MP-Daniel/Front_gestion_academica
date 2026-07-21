import { useEffect, useState, type FormEvent } from 'react'
import { CalendarCheck, Lock, Pencil, Plus, Unlock, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { crearAnioLectivo, activarAnioLectivo } from '@/api/aniosLectivos.api'
import { cerrarPeriodo, crearPeriodo, listarPeriodos, actualizarPeriodo, reabrirPeriodo } from '@/api/periodos.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import type { AnioLectivo } from '@/types/anioLectivo.types'
import type { Periodo } from '@/types/periodo.types'
import { InstitucionConfig } from './InstitucionConfig'

const FORM_PERIODO_VACIO = { nombre: '', porcentaje: '', fechaInicio: '', fechaFin: '' }

export default function Configuracion() {
  const { anios, anioActivo, cargando, cargarAnios, seleccionarAnio } = useAnioLectivo()

  const [anioNuevo, setAnioNuevo] = useState('')
  const [activarAlCrear, setActivarAlCrear] = useState(false)
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null)

  const [anioAActivar, setAnioAActivar] = useState<AnioLectivo | null>(null)
  const [activando, setActivando] = useState(false)
  const [errorActivar, setErrorActivar] = useState<string | null>(null)

  // Modal de periodos académicos
  const [anioPeriodos, setAnioPeriodos] = useState<AnioLectivo | null>(null)
  const [periodos, setPeriodos] = useState<Periodo[] | null>(null)
  const [errorPeriodos, setErrorPeriodos] = useState<string | null>(null)
  const [recargaPeriodos, setRecargaPeriodos] = useState(0)

  const [periodoEditando, setPeriodoEditando] = useState<Periodo | 'nuevo' | null>(null)
  const [formPeriodo, setFormPeriodo] = useState(FORM_PERIODO_VACIO)
  const [guardandoPeriodo, setGuardandoPeriodo] = useState(false)
  const [errorGuardarPeriodo, setErrorGuardarPeriodo] = useState<string | null>(null)

  const [cambiandoEstadoId, setCambiandoEstadoId] = useState<number | null>(null)
  const [errorCambiarEstado, setErrorCambiarEstado] = useState<string | null>(null)

  useEffect(() => {
    if (!anioPeriodos) return
    let vigente = true
    setErrorPeriodos(null)
    setPeriodos(null)

    listarPeriodos(anioPeriodos.id)
      .then((datos) => {
        if (vigente) setPeriodos(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorPeriodos(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [anioPeriodos, recargaPeriodos])

  const manejarCrear = async (evento: FormEvent) => {
    evento.preventDefault()
    const anioNumerico = Number(anioNuevo)
    if (!anioNumerico) return

    setCreando(true)
    setErrorCreacion(null)
    try {
      const creado = await crearAnioLectivo({ anio: anioNumerico, activo: false })
      if (activarAlCrear) {
        await activarAnioLectivo(creado.id)
        seleccionarAnio(creado.id)
      }
      await cargarAnios()
      setAnioNuevo('')
      setActivarAlCrear(false)
    } catch (error) {
      setErrorCreacion(extraerMensajeError(error))
    } finally {
      setCreando(false)
    }
  }

  const confirmarActivacion = async () => {
    if (!anioAActivar) return
    setActivando(true)
    setErrorActivar(null)
    try {
      await activarAnioLectivo(anioAActivar.id)
      seleccionarAnio(anioAActivar.id)
      await cargarAnios()
      setAnioAActivar(null)
    } catch (error) {
      setErrorActivar(extraerMensajeError(error))
    } finally {
      setActivando(false)
    }
  }

  const anioPeriodosEsActivo = anioPeriodos && anioActivo && anioPeriodos.id === anioActivo.id

  const iniciarCreacionPeriodo = () => {
    setFormPeriodo(FORM_PERIODO_VACIO)
    setErrorGuardarPeriodo(null)
    setPeriodoEditando('nuevo')
  }

  const iniciarEdicionPeriodo = (periodo: Periodo) => {
    setFormPeriodo({
      nombre: periodo.nombre,
      porcentaje: String(periodo.porcentaje),
      fechaInicio: periodo.fechaInicio,
      fechaFin: periodo.fechaFin,
    })
    setErrorGuardarPeriodo(null)
    setPeriodoEditando(periodo)
  }

  const manejarGuardarPeriodo = async (evento: FormEvent) => {
    evento.preventDefault()
    if (!anioPeriodos || !periodoEditando) return

    const porcentajeNumerico = Number(formPeriodo.porcentaje)
    if (!formPeriodo.nombre.trim()) {
      setErrorGuardarPeriodo('El nombre del periodo es obligatorio.')
      return
    }
    if (!porcentajeNumerico || porcentajeNumerico <= 0 || porcentajeNumerico > 100) {
      setErrorGuardarPeriodo('El porcentaje debe estar entre 0.1 y 100.')
      return
    }
    if (!formPeriodo.fechaInicio || !formPeriodo.fechaFin) {
      setErrorGuardarPeriodo('Las fechas de inicio y fin son obligatorias.')
      return
    }

    setGuardandoPeriodo(true)
    setErrorGuardarPeriodo(null)
    try {
      const datos = {
        nombre: formPeriodo.nombre.trim(),
        porcentaje: porcentajeNumerico,
        fechaInicio: formPeriodo.fechaInicio,
        fechaFin: formPeriodo.fechaFin,
        anioLectivoId: anioPeriodos.id,
      }
      if (periodoEditando === 'nuevo') {
        await crearPeriodo(datos)
      } else {
        await actualizarPeriodo(periodoEditando.id, datos)
      }
      setPeriodoEditando(null)
      setRecargaPeriodos((valor) => valor + 1)
    } catch (error) {
      setErrorGuardarPeriodo(extraerMensajeError(error))
    } finally {
      setGuardandoPeriodo(false)
    }
  }

  const alternarCierrePeriodo = async (periodo: Periodo) => {
    setCambiandoEstadoId(periodo.id)
    setErrorCambiarEstado(null)
    try {
      if (periodo.cerradoParaDocentes) {
        await reabrirPeriodo(periodo.id)
      } else {
        await cerrarPeriodo(periodo.id)
      }
      setRecargaPeriodos((valor) => valor + 1)
    } catch (error) {
      setErrorCambiarEstado(extraerMensajeError(error))
    } finally {
      setCambiandoEstadoId(null)
    }
  }

  return (
    <>
      <Navbar titulo="Configuración" subtitulo="Ajustes generales del sistema" />

      <main className="flex-1 p-8">
        <InstitucionConfig />

        <div className="flex items-center gap-2">
          <CalendarCheck className="text-brand-600" size={22} />
          <h2 className="text-2xl font-bold text-slate-900">Años Lectivos</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Solo puede haber un año lectivo activo a la vez. Todo el sistema opera sobre ese año, aunque
          se puede consultar años anteriores desde el selector del encabezado.
        </p>

        <form
          onSubmit={manejarCrear}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start"
        >
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Ej. 2028"
              value={anioNuevo}
              onChange={(evento) => setAnioNuevo(evento.target.value)}
              error={errorCreacion ?? undefined}
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={activarAlCrear}
                onChange={(evento) => setActivarAlCrear(evento.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
              />
              Activar este año inmediatamente
            </label>
          </div>
          <div className="shrink-0">
            <Button type="submit" isLoading={creando}>
              <Plus size={18} />
              Crear Año Lectivo
            </Button>
          </div>
        </form>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {cargando && anios.length === 0 ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : anios.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No hay años lectivos registrados.</p>
          ) : (
            <ul>
              {[...anios]
                .sort((a, b) => b.anio - a.anio)
                .map((anio) => (
                  <li
                    key={anio.id}
                    className="flex items-center justify-between border-b border-slate-100 px-6 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-slate-900">{anio.anio}</p>
                      <Badge color={anio.activo ? 'brand' : 'slate'}>
                        {anio.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setAnioPeriodos(anio)}
                        className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-800"
                      >
                        Gestionar periodos
                      </button>
                      {!anio.activo && (
                        <button
                          type="button"
                          onClick={() => setAnioAActivar(anio)}
                          className="cursor-pointer text-sm font-medium text-brand-700 hover:text-brand-800"
                        >
                          Activar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {errorActivar && <p className="mt-2 text-sm text-red-500">{errorActivar}</p>}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>

      <DialogoConfirmacion
        abierto={Boolean(anioAActivar)}
        titulo="Activar año lectivo"
        mensaje={
          anioAActivar
            ? `¿Seguro que deseas activar el año ${anioAActivar.anio}? El año ${anioActivo?.anio ?? 'actualmente activo'} se desactivará automáticamente. Todo el sistema pasará a operar sobre ${anioAActivar.anio}.`
            : ''
        }
        procesando={activando}
        textoConfirmar="Activar"
        onConfirmar={confirmarActivacion}
        onCancelar={() => setAnioAActivar(null)}
      />

      {/* Modal: periodos académicos del año */}
      {anioPeriodos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Periodos de {anioPeriodos.anio}</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => {
                  setAnioPeriodos(null)
                  setPeriodoEditando(null)
                }}
                className="cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {!anioPeriodosEsActivo && (
              <p className="mt-2 rounded-lg bg-accent-100 px-3 py-2 text-xs text-accent-700">
                Solo se pueden crear o editar periodos del año lectivo activo. Este año es de solo consulta.
              </p>
            )}

            {periodoEditando ? (
              <form onSubmit={manejarGuardarPeriodo} className="mt-4 flex flex-col gap-4">
                <Input
                  label="Nombre del periodo"
                  placeholder="Ej. Primer Periodo"
                  value={formPeriodo.nombre}
                  onChange={(evento) => setFormPeriodo((v) => ({ ...v, nombre: evento.target.value }))}
                />
                <Input
                  label="Porcentaje (%)"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  placeholder="Ej. 25"
                  value={formPeriodo.porcentaje}
                  onChange={(evento) => setFormPeriodo((v) => ({ ...v, porcentaje: evento.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Fecha de inicio"
                    type="date"
                    value={formPeriodo.fechaInicio}
                    onChange={(evento) => setFormPeriodo((v) => ({ ...v, fechaInicio: evento.target.value }))}
                  />
                  <Input
                    label="Fecha de fin"
                    type="date"
                    value={formPeriodo.fechaFin}
                    onChange={(evento) => setFormPeriodo((v) => ({ ...v, fechaFin: evento.target.value }))}
                  />
                </div>

                {errorGuardarPeriodo && <p className="text-sm text-red-500">{errorGuardarPeriodo}</p>}

                <div className="mt-2 flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setPeriodoEditando(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={guardandoPeriodo}>
                    {periodoEditando === 'nuevo' ? 'Crear periodo' : 'Guardar cambios'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={iniciarCreacionPeriodo}
                    disabled={!anioPeriodosEsActivo}
                    title={!anioPeriodosEsActivo ? 'Solo el año activo puede tener nuevos periodos.' : undefined}
                  >
                    <Plus size={18} />
                    Nuevo periodo
                  </Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  {errorPeriodos ? (
                    <p className="p-6 text-center text-sm text-red-500">{errorPeriodos}</p>
                  ) : !periodos ? (
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  ) : periodos.length === 0 ? (
                    <p className="p-6 text-center text-sm text-slate-400">
                      No hay periodos registrados para este año.
                    </p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          <th className="px-4 py-2">Nombre</th>
                          <th className="px-4 py-2">Fechas</th>
                          <th className="px-4 py-2">%</th>
                          <th className="px-4 py-2">Estado</th>
                          <th className="px-4 py-2 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {periodos.map((periodo) => (
                          <tr key={periodo.id}>
                            <td className="px-4 py-3 font-medium text-slate-900">{periodo.nombre}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {periodo.fechaInicio} — {periodo.fechaFin}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{periodo.porcentaje}%</td>
                            <td className="px-4 py-3">
                              <Badge color={periodo.cerradoParaDocentes ? 'red' : 'brand'}>
                                {periodo.cerradoParaDocentes ? 'Cerrado' : 'Abierto'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-3">
                                <button
                                  type="button"
                                  aria-label={`Editar ${periodo.nombre}`}
                                  disabled={!anioPeriodosEsActivo}
                                  onClick={() => iniciarEdicionPeriodo(periodo)}
                                  className="cursor-pointer text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  aria-label={
                                    periodo.cerradoParaDocentes
                                      ? `Reabrir ${periodo.nombre}`
                                      : `Cerrar ${periodo.nombre}`
                                  }
                                  disabled={cambiandoEstadoId === periodo.id}
                                  onClick={() => alternarCierrePeriodo(periodo)}
                                  className="cursor-pointer text-slate-500 hover:text-slate-700 disabled:opacity-50"
                                >
                                  {periodo.cerradoParaDocentes ? <Unlock size={16} /> : <Lock size={16} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {errorCambiarEstado && <p className="mt-2 text-sm text-red-500">{errorCambiarEstado}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
