import { useAuthStore } from '@/store/auth.store'
import type { Rol } from '@/types/auth.types'

export function useRol(rolesPermitidos: Rol | Rol[]) {
  const rol = useAuthStore((state) => state.usuario?.rol)
  const permitidos = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos]
  return rol !== undefined && permitidos.includes(rol)
}
