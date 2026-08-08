import { api, extraerMensajeErrorDescarga, extraerNombreArchivoDescarga } from './axios'

interface DescargaBoletin {
  archivo: Blob
  nombreArchivo: string
}

// Autoservicio: boletín del periodo actual para el estudiante autenticado.
export async function descargarMiBoletin(): Promise<DescargaBoletin> {
  const respuesta = await api.getBlob('/boletines/mio')
  return {
    archivo: respuesta.data,
    nombreArchivo: extraerNombreArchivoDescarga(respuesta.headers['content-disposition']) ?? 'boletin.pdf',
  }
}

export async function extraerMensajeErrorDescargaBoletin(error: unknown): Promise<string> {
  return extraerMensajeErrorDescarga(error, 'No se pudo generar el boletín.')
}
