import type { EstadoMatricula } from './matricula.types'

export interface Estudiante {
  id: number
  documento: string
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
  activo: boolean
  gradoActualId: number | null
  gradoActualNombre: string | null
  ultimaMatriculaGrado: string | null
  ultimaMatriculaEstado: EstadoMatricula | null
}

export interface SolicitudCrearEstudiante {
  documento: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  email: string
  contrasena: string
}

export interface SolicitudActualizarEstudiante {
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
}
