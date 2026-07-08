export type Rol = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'

export interface Usuario {
  documento: string
  email: string
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
  rol: Rol
}

export interface Credenciales {
  documento: string
  contrasena: string
}

export interface SesionAuth {
  token: string
  usuario: Usuario
}
