import { api } from './axios'
import type {
  SolicitudActualizarEstadoSoporte,
  SolicitudCrearSoporte,
  SolicitudSoporte,
} from '@/types/soporte.types'

export async function crearSolicitudSoporte(datos: SolicitudCrearSoporte): Promise<SolicitudSoporte> {
  return api.post<SolicitudSoporte>('/soporte', datos)
}

export async function listarMisSolicitudesSoporte(): Promise<SolicitudSoporte[]> {
  return api.get<SolicitudSoporte[]>('/soporte/mias')
}

// Solo ADMIN: bandeja completa de solicitudes de todos los usuarios.
export async function listarTodasLasSolicitudesSoporte(): Promise<SolicitudSoporte[]> {
  return api.get<SolicitudSoporte[]>('/soporte')
}

export async function actualizarEstadoSolicitudSoporte(
  id: number,
  datos: SolicitudActualizarEstadoSoporte,
): Promise<SolicitudSoporte> {
  return api.patch<SolicitudSoporte>(`/soporte/${id}/estado`, datos)
}

export async function eliminarSolicitudSoporte(id: number): Promise<void> {
  await api.delete(`/soporte/${id}`)
}
