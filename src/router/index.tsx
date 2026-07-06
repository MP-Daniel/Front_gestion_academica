import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/auth/Login'
import NoAutorizado from '@/pages/NoAutorizado'
import AdminDashboard from '@/pages/admin/Dashboard'
import DocenteDashboard from '@/pages/docente/Dashboard'
import EstudianteDashboard from '@/pages/estudiante/Dashboard'
import { RutaPrivada } from './RutaPrivada'
import { RutaPorRol } from './RutaPorRol'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Login /> },
  { path: '/no-autorizado', element: <NoAutorizado /> },
  {
    element: <RutaPrivada />,
    children: [
      {
        element: <RutaPorRol rolesPermitidos={['ADMIN']} />,
        children: [{ path: '/admin', element: <AdminDashboard /> }],
      },
      {
        element: <RutaPorRol rolesPermitidos={['DOCENTE']} />,
        children: [{ path: '/docente', element: <DocenteDashboard /> }],
      },
      {
        element: <RutaPorRol rolesPermitidos={['ESTUDIANTE']} />,
        children: [{ path: '/estudiante', element: <EstudianteDashboard /> }],
      },
    ],
  },
])
