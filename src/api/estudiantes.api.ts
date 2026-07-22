import { api } from './axios'
import type { PaginaSpring } from '@/types/api.types'
import type { Estudiante, SolicitudActualizarEstudiante, SolicitudCrearEstudiante } from '@/types/estudiante.types'

interface ParametrosListarEstudiantes {
  pagina?: number
  tamanoPagina?: number
  incluirInactivos?: boolean
}

export async function listarEstudiantes({
  pagina = 0,
  tamanoPagina = 10,
  incluirInactivos = true,
}: ParametrosListarEstudiantes = {}): Promise<PaginaSpring<Estudiante>> {
  return api.get<PaginaSpring<Estudiante>>('/estudiantes', {
    params: {
      page: pagina,
      size: tamanoPagina,
      sortBy: 'PRIMER_NOMBRE',
      direction: 'ASC',
      incluirInactivos,
    },
  })
}

export async function crearEstudiante(datos: SolicitudCrearEstudiante): Promise<Estudiante> {
  return api.post<Estudiante>('/estudiantes', datos)
}

export async function obtenerEstudiante(id: number): Promise<Estudiante> {
  return api.get<Estudiante>(`/estudiantes/${id}`)
}

export async function actualizarEstudiante(id: number, datos: SolicitudActualizarEstudiante): Promise<Estudiante> {
  return api.put<Estudiante>(`/estudiantes/${id}`, datos)
}

export async function desactivarEstudiante(id: number): Promise<void> {
  await api.patch(`/estudiantes/${id}/desactivar`)
}

export async function activarEstudiante(id: number): Promise<void> {
  await api.patch(`/estudiantes/${id}/activar`)
}

export async function eliminarEstudiante(id: number): Promise<void> {
  await api.delete(`/estudiantes/${id}`)
}
