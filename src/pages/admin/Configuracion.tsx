import { useState, type FormEvent } from 'react'
import { CalendarCheck, Plus } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { crearAnioLectivo, activarAnioLectivo } from '@/api/aniosLectivos.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import type { AnioLectivo } from '@/types/anioLectivo.types'

export default function Configuracion() {
  const { anios, anioActivo, cargando, cargarAnios, seleccionarAnio } = useAnioLectivo()

  const [anioNuevo, setAnioNuevo] = useState('')
  const [activarAlCrear, setActivarAlCrear] = useState(false)
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState<string | null>(null)

  const [anioAActivar, setAnioAActivar] = useState<AnioLectivo | null>(null)
  const [activando, setActivando] = useState(false)
  const [errorActivar, setErrorActivar] = useState<string | null>(null)

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

  return (
    <>
      <Navbar titulo="Configuración" subtitulo="Ajustes generales del sistema" />

      <main className="flex-1 p-8">
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
                    {!anio.activo && (
                      <button
                        type="button"
                        onClick={() => setAnioAActivar(anio)}
                        className="cursor-pointer text-sm font-medium text-brand-700 hover:text-brand-800"
                      >
                        Activar
                      </button>
                    )}
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
    </>
  )
}
