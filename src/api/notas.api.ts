import { api } from './axios'
import type { NotaDefinitiva } from '@/types/nota.types'

export async function obtenerNotasDefinitivas(matriculaId: number): Promise<NotaDefinitiva[]> {
  return api.get<NotaDefinitiva[]>(`/notas/definitivas/${matriculaId}`)
}

export async function habilitarNota(id: number): Promise<void> {
  await api.patch(`/notas/${id}/habilitar`)
}

export async function bloquearNota(id: number): Promise<void> {
  await api.patch(`/notas/${id}/bloquear`)
}
