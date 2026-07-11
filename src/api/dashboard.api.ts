import { api } from './axios'
import type { DashboardEstudiante } from '@/types/dashboardEstudiante.types'

export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante')
}
