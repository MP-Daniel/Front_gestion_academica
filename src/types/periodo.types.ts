import type { AnioLectivo } from './anioLectivo.types'

export interface Periodo {
  id: number
  nombre: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  activo: boolean
  cerradoParaDocentes: boolean
  anioLectivo: AnioLectivo
}

export interface SolicitudPeriodo {
  nombre: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  anioLectivoId: number
}
