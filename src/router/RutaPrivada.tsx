// router/RutaPrivada.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export function RutaPrivada() {
  const token = useAuthStore((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
