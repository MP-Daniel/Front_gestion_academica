import { api } from './axios'
import type { Asignatura, SolicitudAsignatura } from '@/types/academico.types'

export async function listarAsignaturas(): Promise<Asignatura[]> {
  return api.get<Asignatura[]>('/academico/asignaturas')
}

export async function crearAsignatura(datos: SolicitudAsignatura): Promise<Asignatura> {
  return api.post<Asignatura>('/academico/asignaturas', datos)
}

export async function actualizarAsignatura(id: number, datos: SolicitudAsignatura): Promise<Asignatura> {
  return api.put<Asignatura>(`/academico/asignaturas/${id}`, datos)
}

export async function eliminarAsignatura(id: number): Promise<void> {
  await api.delete(`/academico/asignaturas/${id}`)
}
