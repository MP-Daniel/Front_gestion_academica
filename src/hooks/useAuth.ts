import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const token = useAuthStore((state) => state.token)
  const usuario = useAuthStore((state) => state.usuario)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setSesion = useAuthStore((state) => state.setSesion)
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion)

  return { token, usuario, isAuthenticated, setSesion, cerrarSesion }
}
