export interface ResumenDocenteDashboard {
  nombreCompleto: string
  cargo: string
}

export interface ClaseHoyDocente {
  id: number
  asignatura: string
  grado: string
  horaInicio: string
  horaFin: string
  cantidadEstudiantes: number
}

export interface CierrePeriodoResumen {
  nombrePeriodo: string | null
  porcentajeCompletado: number
  diasRestantes: number
  planillasSinCalificar: number
}

export interface EstudianteBajoRendimiento {
  estudianteId: number
  nombreCompleto: string
  gradoNombre: string
  nombreAsignatura: string
  promedio: number
}

export interface DashboardDocente {
  docente: ResumenDocenteDashboard
  planillasPendientes: number
  clasesDeHoy: ClaseHoyDocente[]
  cierrePeriodo: CierrePeriodoResumen
  estudiantesBajoRendimiento: EstudianteBajoRendimiento[]
}
