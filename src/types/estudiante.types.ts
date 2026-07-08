export interface Estudiante {
  id: number
  documento: string
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
  activo: boolean
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
