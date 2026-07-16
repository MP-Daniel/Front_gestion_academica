import { api } from './axios'
import type { DashboardEstudiante } from '@/types/dashboardEstudiante.types'
import type { DashboardAdmin } from '@/types/dashboardAdmin.types'

export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante')
}

export async function obtenerDashboardAdmin(): Promise<DashboardAdmin> {
  return api.get<DashboardAdmin>('/dashboard/admin')
}
