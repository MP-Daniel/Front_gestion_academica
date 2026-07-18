import { api } from './axios'
import type { EventoInstitucional, SolicitudCrearEvento } from '@/types/eventos.types'

export async function listarEventos(): Promise<EventoInstitucional[]> {
  return api.get<EventoInstitucional[]>('/eventos')
}

export async function crearEvento(datos: SolicitudCrearEvento): Promise<EventoInstitucional> {
  return api.post<EventoInstitucional>('/eventos', datos)
}

export async function eliminarEvento(id: number): Promise<void> {
  return api.delete(`/eventos/${id}`)
}
