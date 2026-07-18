// Contratos del dashboard del administrador: GET /api/dashboard/admin

export interface DashboardAdmin {
  totalEstudiantes: number
  matriculasActivas: number
  docentesActivos: number
  totalAsignaturas: number
  totalGrados: number
  anioLectivoActivo: number | null
}