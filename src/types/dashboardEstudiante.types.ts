// Contratos propuestos para el dashboard del estudiante.
// El backend aún no expone este endpoint: se sugiere GET /api/dashboard/estudiante
// (protegido con hasRole('ESTUDIANTE'), resolviendo el estudiante a partir del
// @AuthenticationPrincipal, igual que el resto de los endpoints de autoservicio).

export type NivelPromedio = 'BAJO' | 'BASICO' | 'ALTO' | 'SUPERIOR'

export interface ResumenEstudianteDashboard {
  nombreCompleto: string
  gradoNombre: string
  jornada: string | null
}

export interface ResumenPromedio {
  valor: number
  nivel: NivelPromedio
  variacionPeriodoAnterior: number
  historicoPeriodos: number[]
}

export interface EventoProximo {
  id: number
  titulo: string
  descripcion: string
  fecha: string
  lugar: string | null
}

export interface AsignaturaHoy {
  id: number
  nombre: string
  horaInicio: string
  horaFin: string
}

export interface DashboardEstudiante {
  estudiante: ResumenEstudianteDashboard
  promedioGeneral: ResumenPromedio
  entregasPendientes: number
  proximosEventos: EventoProximo[]
  asignaturasHoy: AsignaturaHoy[]
}
