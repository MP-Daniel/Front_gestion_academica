export type Rol = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE'

export interface Usuario {
  id: string
  nombre: string
  usuario: string
  rol: Rol
}

export interface Credenciales {
  usuario: string
  contrasena: string
}

export interface SesionAuth {
  token: string
  usuario: Usuario
}
