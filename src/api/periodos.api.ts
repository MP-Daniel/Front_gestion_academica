import { api } from './axios'
import type { Periodo, SolicitudPeriodo } from '@/types/periodo.types'

export async function listarPeriodos(anioLectivoId: number): Promise<Periodo[]> {
  return api.get<Periodo[]>(`/academico/periodos/anio/${anioLectivoId}`)
}

export async function crearPeriodo(datos: SolicitudPeriodo): Promise<Periodo> {
  return api.post<Periodo>('/academico/periodos', datos)
}

export async function actualizarPeriodo(id: number, datos: SolicitudPeriodo): Promise<Periodo> {
  return api.put<Periodo>(`/academico/periodos/${id}`, datos)
}

export async function cerrarPeriodo(id: number): Promise<Periodo> {
  return api.patch<Periodo>(`/academico/periodos/${id}/cerrar`)
}

export async function reabrirPeriodo(id: number): Promise<Periodo> {
  return api.patch<Periodo>(`/academico/periodos/${id}/reabrir`)
}
