import { api } from './axios'
import type { Matricula, SolicitudCambiarEstado, SolicitudCrearMatricula } from '@/types/matricula.types'

export async function crearMatricula(datos: SolicitudCrearMatricula): Promise<Matricula> {
  return api.post<Matricula>('/matriculas', datos)
}

export async function cambiarEstadoMatricula(id: number, datos: SolicitudCambiarEstado): Promise<Matricula> {
  return api.patch<Matricula>(`/matriculas/${id}/estado`, datos)
}

export async function listarMatriculasPorGrado(gradoId: number, anio?: number): Promise<Matricula[]> {
  return api.get<Matricula[]>(`/matriculas/grado/${gradoId}`, { params: anio ? { anio } : undefined })
}

export async function historialMatriculasEstudiante(documento: string): Promise<Matricula[]> {
  return api.get<Matricula[]>(`/matriculas/estudiante/${documento}`)
}
