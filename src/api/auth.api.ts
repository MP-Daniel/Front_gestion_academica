import type { Credenciales, SesionAuth, Usuario } from '@/types/auth.types'

// Mock temporal en memoria mientras se conecta la API real de autenticación.
const USUARIOS_MOCK: Array<Usuario & { contrasena: string }> = [
  { id: '1', nombre: 'Ana Administradora', usuario: 'admin', contrasena: 'admin123', rol: 'ADMIN' },
  { id: '2', nombre: 'Carlos Docente', usuario: 'docente', contrasena: 'docente123', rol: 'DOCENTE' },
  { id: '3', nombre: 'Sofía Estudiante', usuario: 'estudiante', contrasena: 'estudiante123', rol: 'ESTUDIANTE' },
]

export async function login({ usuario, contrasena }: Credenciales): Promise<SesionAuth> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const encontrado = USUARIOS_MOCK.find(
    (u) => u.usuario === usuario && u.contrasena === contrasena,
  )

  if (!encontrado) {
    throw new Error('Usuario o contraseña incorrectos')
  }

  const usuarioAutenticado: Usuario = {
    id: encontrado.id,
    nombre: encontrado.nombre,
    usuario: encontrado.usuario,
    rol: encontrado.rol,
  }

  return {
    token: `mock-token-${encontrado.id}`,
    usuario: usuarioAutenticado,
  }
}

export async function logout(): Promise<void> {
  await Promise.resolve()
}
