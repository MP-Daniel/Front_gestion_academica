import type { EstadoMatricula } from './matricula.types'

export interface ResumenAnioLectivoCalificaciones {
  anio: number | null
  gradoNombre: string
  // Null solo cuando el estudiante no tiene matrícula en el año lectivo activo.
  estadoMatricula: EstadoMatricula | null
  directorGrupo: string | null
  periodoActual: string | null
}

export interface ResumenAcademico {
  promedioGeneral: number
  variacionPeriodoAnterior: number
  asignaturasAprobadas: number
  totalAsignaturas: number
  puestoEnGrupo: number | null
  totalEstudiantesGrupo: number
  pendientesAcademicos: number
}

export interface NotaPeriodo {
  nombrePeriodo: string
  valor: number
}

export interface AsignaturaCalificacion {
  cargaAcademicaId: number
  nombreAsignatura: string
  nombreDocente: string
  notasPorPeriodo: NotaPeriodo[]
  notaFinal: number
}

export interface CalificacionesEstudiante {
  anioLectivo: ResumenAnioLectivoCalificaciones
  resumen: ResumenAcademico
  asignaturas: AsignaturaCalificacion[]
}
