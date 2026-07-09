export interface Docente {
  id: number
  documento: string
  email: string
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
  firmaUrl: string | null
  activo: boolean
  materias: string[]
}

export interface SolicitudCrearDocente {
  documento: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  email: string
  contrasena: string
}

export interface SolicitudActualizarDocente {
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
}
