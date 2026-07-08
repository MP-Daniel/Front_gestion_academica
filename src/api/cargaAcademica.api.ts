import { api } from './axios'
import type { CargaAcademica, SolicitudCrearCarga, SolicitudReasignarDocente } from '@/types/carga.types'

export async function crearCarga(datos: SolicitudCrearCarga): Promise<CargaAcademica> {
  return api.post<CargaAcademica>('/carga-academica', datos)
}

export async function listarCargasPorGrado(gradoId: number, anio?: number): Promise<CargaAcademica[]> {
  return api.get<CargaAcademica[]>(`/carga-academica/grado/${gradoId}`, { params: anio ? { anio } : undefined })
}

export async function reasignarDocenteCarga(id: number, datos: SolicitudReasignarDocente): Promise<CargaAcademica> {
  return api.patch<CargaAcademica>(`/carga-academica/${id}/docente`, datos)
}

export async function eliminarCarga(id: number): Promise<void> {
  await api.delete(`/carga-academica/${id}`)
}
