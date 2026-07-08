import { api } from './axios'
import type { Asignatura, Grado, SolicitudAsignatura, SolicitudGrado } from '@/types/academico.types'

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

export async function listarGrados(): Promise<Grado[]> {
  return api.get<Grado[]>('/academico/grados')
}

export async function crearGrado(datos: SolicitudGrado): Promise<Grado> {
  return api.post<Grado>('/academico/grados', datos)
}

export async function actualizarGrado(id: number, datos: SolicitudGrado): Promise<Grado> {
  return api.put<Grado>(`/academico/grados/${id}`, datos)
}

export async function eliminarGrado(id: number): Promise<void> {
  await api.delete(`/academico/grados/${id}`)
}
