import { api } from './axios'
import type { DashboardEstudiante } from '@/types/dashboardEstudiante.types'

// Endpoint propuesto, todavía no implementado en el backend.
// Ver la nota de contrato en '@/types/dashboardEstudiante.types'.
export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante')
}
