import { api } from './axios'
import type { Credenciales, Rol, SesionAuth, Usuario } from '@/types/auth.types'

// Forma cruda que devuelve el backend (ver esquema RespuestaAuth en Swagger): plana,
// sin separar token y datos del usuario. Se normaliza abajo a SesionAuth.
interface RespuestaLoginApi {
  token: string
  documento: string
  email: string
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
  rol: Rol
}

export async function login(credenciales: Credenciales): Promise<SesionAuth> {
  const respuesta = await api.post<RespuestaLoginApi>('/auth/login', credenciales)

  const usuario: Usuario = {
    documento: respuesta.documento,
    email: respuesta.email,
    primerNombre: respuesta.primerNombre,
    segundoNombre: respuesta.segundoNombre,
    primerApellido: respuesta.primerApellido,
    segundoApellido: respuesta.segundoApellido,
    rol: respuesta.rol,
  }

  return { token: respuesta.token, usuario }
}

export async function logout(): Promise<void> {
  await Promise.resolve()
}
