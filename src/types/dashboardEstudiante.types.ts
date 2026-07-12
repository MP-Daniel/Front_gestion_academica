// Contratos del dashboard del estudiante: GET /api/dashboard/estudiante
// (protegido con hasRole('ESTUDIANTE'), resuelve el estudiante a partir del
// @AuthenticationPrincipal, igual que el resto de los endpoints de autoservicio).

import type { EstadoMatricula } from './matricula.types'
import type { EventoInstitucional } from './eventos.types'

export type { EventoInstitucional as EventoProximo } from './eventos.types'

export type NivelPromedio = 'BAJO' | 'BASICO' | 'ALTO' | 'SUPERIOR'

export interface ResumenEstudianteDashboard {
  nombreCompleto: string
  gradoNombre: string
  // Null solo cuando el estudiante no tiene matrícula en el año lectivo activo.
  estadoMatricula: EstadoMatricula | null
  jornada: string | null
}

export interface ResumenPromedio {
  valor: number
  nivel: NivelPromedio
  variacionPeriodoAnterior: number
  historicoPeriodos: number[]
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
  proximosEventos: EventoInstitucional[]
  asignaturasHoy: AsignaturaHoy[]
}