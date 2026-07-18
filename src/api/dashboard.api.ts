import { api } from './axios'
import type { DashboardEstudiante } from '@/types/dashboardEstudiante.types'
import type { DashboardAdmin } from '@/types/dashboardAdmin.types'
import type { DashboardDocente } from '@/types/dashboardDocente.types'

export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante')
}

export async function obtenerDashboardAdmin(): Promise<DashboardAdmin> {
  return api.get<DashboardAdmin>('/dashboard/admin')
export async function obtenerDashboardDocente(): Promise<DashboardDocente> {
  return api.get<DashboardDocente>('/dashboard/docente')
}
