import { api } from './axios'
import type { AnioLectivo, SolicitudAnioLectivo } from '@/types/anioLectivo.types'

export async function listarAniosLectivos(): Promise<AnioLectivo[]> {
  return api.get<AnioLectivo[]>('/anios-lectivos')
}

export async function crearAnioLectivo(datos: SolicitudAnioLectivo): Promise<AnioLectivo> {
  return api.post<AnioLectivo>('/anios-lectivos', datos)
}

export async function actualizarAnioLectivo(id: number, datos: SolicitudAnioLectivo): Promise<AnioLectivo> {
  return api.put<AnioLectivo>(`/anios-lectivos/${id}`, datos)
}

// No existe un endpoint de "activar": la regla del backend es "un solo activo a la vez",
// aplicada como validación que rechaza, no como intercambio automático. Por eso aquí se
// hace en dos pasos (desactivar el actual, activar el nuevo) y se intenta revertir si el
// segundo paso falla, para no dejar el sistema sin ningún año activo.
export async function activarAnioLectivo(id: number): Promise<AnioLectivo[]> {
  const anios = await listarAniosLectivos()
  const objetivo = anios.find((anio) => anio.id === id)

  if (!objetivo) {
    throw new Error('Año lectivo no encontrado')
  }

  if (!objetivo.activo) {
    const actual = anios.find((anio) => anio.activo)

    if (actual) {
      await actualizarAnioLectivo(actual.id, { anio: actual.anio, activo: false })
      try {
        await actualizarAnioLectivo(objetivo.id, { anio: objetivo.anio, activo: true })
      } catch (error) {
        await actualizarAnioLectivo(actual.id, { anio: actual.anio, activo: true }).catch(() => {})
        throw error
      }
    } else {
      await actualizarAnioLectivo(objetivo.id, { anio: objetivo.anio, activo: true })
    }
  }

  return listarAniosLectivos()
}
