import { api } from './axios'
import type { PaginaSpring } from '@/types/api.types'
import type { Docente, SolicitudActualizarDocente, SolicitudCrearDocente } from '@/types/docente.types'

interface ParametrosListarDocentes {
  pagina?: number
  tamanoPagina?: number
  incluirInactivos?: boolean
}

export async function listarDocentes({
  pagina = 0,
  tamanoPagina = 10,
  incluirInactivos = true,
}: ParametrosListarDocentes = {}): Promise<PaginaSpring<Docente>> {
  return api.get<PaginaSpring<Docente>>('/docentes', {
    params: {
      page: pagina,
      size: tamanoPagina,
      sortBy: 'PRIMER_NOMBRE',
      direction: 'ASC',
      incluirInactivos,
    },
  })
}

export async function crearDocente(datos: SolicitudCrearDocente): Promise<Docente> {
  return api.post<Docente>('/docentes', datos)
}

export async function obtenerDocente(id: number): Promise<Docente> {
  return api.get<Docente>(`/docentes/${id}`)
}

export async function actualizarDocente(id: number, datos: SolicitudActualizarDocente): Promise<Docente> {
  return api.put<Docente>(`/docentes/${id}`, datos)
}

export async function actualizarFirmaDocente(id: number, archivo: File): Promise<Docente> {
  const formData = new FormData()
  formData.append('firma', archivo)
  return api.put<Docente>(`/docentes/${id}/firma`, formData)
}

export async function desactivarDocente(id: number): Promise<void> {
  await api.patch(`/docentes/${id}/desactivar`)
}

export async function activarDocente(id: number): Promise<void> {
  await api.patch(`/docentes/${id}/activar`)
}

export async function eliminarDocente(id: number): Promise<void> {
  await api.delete(`/docentes/${id}`)
}
