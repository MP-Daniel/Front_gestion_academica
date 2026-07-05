// Componente de seguridad (HOC) para restringir accesos según los roles ADMIN, DOCENTE o ESTUDIANTE
// router/RutaPorRol.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import type { Rol } from "@/types/auth.types";

interface Props {
  rolesPermitidos: Rol[];
}

export function RutaPorRol({ rolesPermitidos }: Props) {
  const usuario = useAuthStore((s) => s.usuario);
  if (!usuario) return <Navigate to="/login" replace />;
  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }
  return <Outlet />;
}