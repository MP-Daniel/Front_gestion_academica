import { api } from './axios'
import type { EventoInstitucional } from '@/types/eventos.types'

export async function listarEventos(): Promise<EventoInstitucional[]> {
  return api.get<EventoInstitucional[]>('/eventos')
}
