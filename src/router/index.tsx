import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/auth/Login'
import NoAutorizado from '@/pages/NoAutorizado'
import NoEncontrado from '@/pages/NoEncontrado'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminDocentes from '@/pages/admin/Docentes'
import DocenteFormulario from '@/pages/admin/DocenteFormulario'
import AdminEstudiantes from '@/pages/admin/Estudiantes'
import EstudianteFormulario from '@/pages/admin/EstudianteFormulario'
import EstudiantePerfil from '@/pages/admin/EstudiantePerfil'
import AdminMaterias from '@/pages/admin/Materias'
import AdminCursos from '@/pages/admin/Cursos'
import CursoDetalle from '@/pages/admin/CursoDetalle'
import AdminConfiguracion from '@/pages/admin/Configuracion'
import DocenteDashboard from '@/pages/docente/Dashboard'
import DocentePlanilla from '@/pages/docente/Planilla'
import EstudianteDashboard from '@/pages/estudiante/Dashboard'
import EstudianteCalificaciones from '@/pages/estudiante/Calificaciones'
import Calendario from '@/pages/Calendario'
import { RutaPrivada } from './RutaPrivada'
import { RutaPorRol } from './RutaPorRol'
import { Layout } from '@/components/layout/Layout'

export const router = createBrowserRouter([
  {
    errorElement: <NoEncontrado />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <Login /> },
      { path: '/no-autorizado', element: <NoAutorizado /> },
      {
        element: <RutaPrivada />,
        children: [
          {
            element: <RutaPorRol rolesPermitidos={['ADMIN']} />,
            children: [
              {
                element: <Layout />,
                children: [
                  { path: '/admin', element: <AdminDashboard /> },
                  { path: '/admin/docentes', element: <AdminDocentes /> },
                  { path: '/admin/docentes/nuevo', element: <DocenteFormulario /> },
                  { path: '/admin/docentes/:id/editar', element: <DocenteFormulario /> },
                  { path: '/admin/estudiantes', element: <AdminEstudiantes /> },
                  { path: '/admin/estudiantes/nuevo', element: <EstudianteFormulario /> },
                  { path: '/admin/estudiantes/:id/editar', element: <EstudianteFormulario /> },
                  { path: '/admin/estudiantes/:id/perfil', element: <EstudiantePerfil /> },
                  { path: '/admin/materias', element: <AdminMaterias /> },
                  { path: '/admin/cursos', element: <AdminCursos /> },
                  { path: '/admin/cursos/:id', element: <CursoDetalle /> },
                  { path: '/admin/configuracion', element: <AdminConfiguracion /> },
                ],
              },
            ],
          },
          {
            element: <RutaPorRol rolesPermitidos={['DOCENTE']} />,
            children: [
              {
                element: <Layout />,
                children: [
                  { path: '/docente', element: <DocenteDashboard /> },
                  { path: '/docente/planilla', element: <DocentePlanilla /> },
                ],
              },
            ],
          },
          {
            element: <RutaPorRol rolesPermitidos={['ESTUDIANTE']} />,
            children: [
              {
                element: <Layout />,
                children: [
                  { path: '/estudiante', element: <EstudianteDashboard /> },
                  { path: '/estudiante/calificaciones', element: <EstudianteCalificaciones /> },
                  { path: '/estudiante/calendario', element: <Navigate to="/calendario" replace /> },
                ],
              },
            ],
          },
          {
            element: <RutaPorRol rolesPermitidos={['ADMIN', 'ESTUDIANTE']} />,
            children: [
              {
                element: <Layout />,
                children: [{ path: '/calendario', element: <Calendario /> }],
              },
            ],
          },
        ],
      },
    ],
  },
])
