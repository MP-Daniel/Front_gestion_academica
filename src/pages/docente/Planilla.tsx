import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { NavbarDocente } from '@/components/layout/NavbarDocente'
import { SelectorPlanilla } from '@/components/docente/SelectorPlanilla'
import { SubirPlanilla } from '@/components/docente/SubirPlanilla'
import { ConfirmacionImportacion } from '@/components/docente/ConfirmacionImportacion'
import { ResultadoImportacion } from '@/components/docente/ResultadoImportacion'
import { TablaNotasPlanilla } from '@/components/docente/TablaNotasPlanilla'
import { listarMisCargas } from '@/api/cargaAcademica.api'
import {
  descargarPlantilla,
  extraerErroresImportacion,
  extraerMensajeErrorDescarga,
  importarNotas,
  listarPeriodosActivos,
  obtenerNotasPorCargaYPeriodo,
  previsualizarImportacion,
} from '@/api/notas.api'
import { extraerMensajeError } from '@/api/axios'
import type { CargaAcademica } from '@/types/carga.types'
import type { Periodo } from '@/types/periodo.types'
import type {
  ErrorFilaImportacion,
  Nota,
  ResultadoImportacionNotas,
  ResultadoPreviewImportacion,
} from '@/types/nota.types'

export default function Planilla() {
  const { usuario } = useAuth()

  const [cargas, setCargas] = useState<CargaAcademica[] | null>(null)
  const [periodos, setPeriodos] = useState<Periodo[] | null>(null)
  const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null)

  const [cargaAcademicaId, setCargaAcademicaId] = useState<number | ''>('')
  const [periodoId, setPeriodoId] = useState<number | ''>('')

  const [descargando, setDescargando] = useState(false)
  const [errorDescarga, setErrorDescarga] = useState<string | null>(null)

  const [archivo, setArchivo] = useState<File | null>(null)
  const [previsualizando, setPrevisualizando] = useState(false)
  const [previsualizacion, setPrevisualizacion] = useState<ResultadoPreviewImportacion | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoImportacionNotas | null>(null)
  const [erroresImportacion, setErroresImportacion] = useState<ErrorFilaImportacion[] | null>(null)
  const [errorImportacion, setErrorImportacion] = useState<string | null>(null)
  const [notasGuardadas, setNotasGuardadas] = useState<Nota[]>([])

  useEffect(() => {
    let vigente = true

    Promise.all([listarMisCargas(), listarPeriodosActivos()])
      .then(([datosCargas, datosPeriodos]) => {
        if (!vigente) return
        setCargas(datosCargas)
        setPeriodos(datosPeriodos)
      })
      .catch((error: unknown) => {
        if (vigente) setErrorCatalogo(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [])

  const limpiarResultadoImportacion = () => {
    setPrevisualizacion(null)
    setResultado(null)
    setErroresImportacion(null)
    setErrorImportacion(null)
    setNotasGuardadas([])
  }

  const manejarCambiarCarga = (id: number | '') => {
    setCargaAcademicaId(id)
    setErrorDescarga(null)
    limpiarResultadoImportacion()
  }

  const manejarCambiarPeriodo = (id: number | '') => {
    setPeriodoId(id)
    setErrorDescarga(null)
    limpiarResultadoImportacion()
  }

  const manejarDescargarPlantilla = async () => {
    if (cargaAcademicaId === '' || periodoId === '') return

    setDescargando(true)
    setErrorDescarga(null)
    try {
      const { archivo: blob, nombreArchivo } = await descargarPlantilla(cargaAcademicaId, periodoId)
      const url = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = nombreArchivo
      document.body.appendChild(enlace)
      enlace.click()
      document.body.removeChild(enlace)
      URL.revokeObjectURL(url)
    } catch (error) {
      setErrorDescarga(await extraerMensajeErrorDescarga(error))
    } finally {
      setDescargando(false)
    }
  }

  const manejarPrevisualizar = async () => {
    if (cargaAcademicaId === '' || periodoId === '' || !archivo) return

    setPrevisualizando(true)
    limpiarResultadoImportacion()
    try {
      const datos = await previsualizarImportacion(cargaAcademicaId, periodoId, archivo)
      setPrevisualizacion(datos)
    } catch (error) {
      const errores = extraerErroresImportacion(error)
      if (errores && errores.length > 0) {
        setErroresImportacion(errores)
      } else {
        setErrorImportacion(extraerMensajeError(error))
      }
    } finally {
      setPrevisualizando(false)
    }
  }

  const manejarConfirmarImportacion = async () => {
    if (cargaAcademicaId === '' || periodoId === '' || !archivo) return

    setConfirmando(true)
    try {
      const datos = await importarNotas(cargaAcademicaId, periodoId, archivo)
      setResultado(datos)
      setArchivo(null)
      const notas = await obtenerNotasPorCargaYPeriodo(cargaAcademicaId, periodoId)
      setNotasGuardadas(notas)
    } catch (error) {
      const errores = extraerErroresImportacion(error)
      if (errores && errores.length > 0) {
        setErroresImportacion(errores)
      } else {
        setErrorImportacion(extraerMensajeError(error))
      }
    } finally {
      setPrevisualizacion(null)
      setConfirmando(false)
    }
  }

  if (!usuario) return null

  return (
    <>
      <NavbarDocente usuario={usuario} raiz="Portal Docente" seccionActual="Planilla de Calificaciones" />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-slate-900">Planilla de Calificaciones</h2>
        <p className="mt-1 text-sm text-slate-500">
          Descarga la plantilla, regístra las notas en Excel y vuelve a subirla para guardarlas.
        </p>

        <div className="mt-6 flex flex-col gap-6">
          {errorCatalogo ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
              {errorCatalogo}
            </p>
          ) : !cargas || !periodos ? (
            <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16">
              <Spinner />
            </div>
          ) : cargas.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No tienes asignaturas a cargo en el año lectivo activo.
            </p>
          ) : (
            <>
              <SelectorPlanilla
                cargas={cargas}
                periodos={periodos}
                cargaAcademicaId={cargaAcademicaId}
                periodoId={periodoId}
                onCambiarCarga={manejarCambiarCarga}
                onCambiarPeriodo={manejarCambiarPeriodo}
                onDescargarPlantilla={manejarDescargarPlantilla}
                descargando={descargando}
              />
              {errorDescarga && <p className="text-sm text-red-500">{errorDescarga}</p>}

              <SubirPlanilla
                archivo={archivo}
                onCambiarArchivo={(nuevoArchivo) => {
                  setArchivo(nuevoArchivo)
                  limpiarResultadoImportacion()
                }}
                onPrevisualizar={manejarPrevisualizar}
                puedeSubir={cargaAcademicaId !== '' && periodoId !== '' && archivo !== null && !previsualizando}
                previsualizando={previsualizando}
              />

              {previsualizacion && (
                <ConfirmacionImportacion
                  previsualizacion={previsualizacion}
                  confirmando={confirmando}
                  onConfirmar={manejarConfirmarImportacion}
                  onCancelar={() => setPrevisualizacion(null)}
                />
              )}

              <ResultadoImportacion resultado={resultado} errores={erroresImportacion} mensajeError={errorImportacion} />

              <TablaNotasPlanilla notas={notasGuardadas} />
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>
    </>
  )
}
