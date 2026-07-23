import axios from 'axios'
import { api, extraerMensajeError } from './axios'
import type { ErrorFilaImportacion, Nota, NotaDefinitiva, ResultadoImportacionNotas } from '@/types/nota.types'
import type { Periodo } from '@/types/periodo.types'

export async function obtenerNotasDefinitivas(matriculaId: number): Promise<NotaDefinitiva[]> {
  return api.get<NotaDefinitiva[]>(`/notas/definitivas/${matriculaId}`)
}

export async function habilitarNota(id: number): Promise<void> {
  await api.patch(`/notas/${id}/habilitar`)
}

export async function bloquearNota(id: number): Promise<void> {
  await api.patch(`/notas/${id}/bloquear`)
}

// Autoservicio: periodos del año lectivo activo, accesibles para el docente
// (a diferencia de /academico/periodos/anio/{id}, que es exclusivo de ADMIN).
export async function listarPeriodosActivos(): Promise<Periodo[]> {
  return api.get<Periodo[]>('/notas/periodos')
}

export async function obtenerNotasPorCargaYPeriodo(cargaAcademicaId: number, periodoId: number): Promise<Nota[]> {
  return api.get<Nota[]>(`/notas/carga/${cargaAcademicaId}/periodo/${periodoId}`)
}

interface DescargaPlantilla {
  archivo: Blob
  nombreArchivo: string
}

export async function descargarPlantilla(cargaAcademicaId: number, periodoId: number): Promise<DescargaPlantilla> {
  const respuesta = await api.getBlob('/notas/plantilla', {
    params: { cargaAcademicaId, periodoId },
  })
  return {
    archivo: respuesta.data,
    nombreArchivo: extraerNombreArchivo(respuesta.headers['content-disposition']) ?? 'plantilla.xlsx',
  }
}

export async function importarNotas(
  cargaAcademicaId: number,
  periodoId: number,
  archivo: File,
): Promise<ResultadoImportacionNotas> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<ResultadoImportacionNotas>('/notas/importar', formData, {
    params: { cargaAcademicaId, periodoId },
  })
}

function extraerNombreArchivo(contentDisposition?: string): string | null {
  if (!contentDisposition) return null
  const coincidencia = /filename="([^"]+)"/.exec(contentDisposition)
  return coincidencia?.[1] ?? null
}

// El backend responde una importación inválida (422) con { errores: [...] } además del
// mensaje general; esto extrae el detalle fila por fila para mostrarlo en una tabla.
export function extraerErroresImportacion(error: unknown): ErrorFilaImportacion[] | null {
  if (axios.isAxiosError<{ errores?: ErrorFilaImportacion[] }>(error)) {
    return error.response?.data?.errores ?? null
  }
  return null
}

// La descarga de la plantilla usa responseType "blob", así que un error de la API
// (ej. 404 carga no encontrada) también llega como Blob en vez de JSON. extraerMensajeError
// no sabe leer eso, por eso esta versión intenta primero decodificar el Blob como JSON.
export async function extraerMensajeErrorDescarga(error: unknown): Promise<string> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const texto = await error.response.data.text()
      const cuerpo = JSON.parse(texto) as { mensaje?: string }
      return cuerpo.mensaje ?? 'No se pudo descargar la plantilla.'
    } catch {
      return 'No se pudo descargar la plantilla.'
    }
  }
  return extraerMensajeError(error)
}
