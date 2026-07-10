import { api } from './axios'
import type { CalificacionesEstudiante } from '@/types/calificaciones.types'

export async function obtenerCalificacionesEstudiante(): Promise<CalificacionesEstudiante> {
  return api.get<CalificacionesEstudiante>('/calificaciones/estudiante/actual')
}
