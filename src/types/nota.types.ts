export interface DetalleNotaPeriodo {
  id: number
  nombrePeriodo: string
  porcentaje: number
  valor: number
  aporte: number
}

export interface NotaDefinitiva {
  nombreAsignatura: string
  cargaAcademicaId: number
  notasPorPeriodo: DetalleNotaPeriodo[]
  notaDefinitiva: number
}

export interface Nota {
  id: number
  matriculaId: number
  documentoEstudiante: string
  nombreEstudiante: string
  cargaAcademicaId: number
  nombreAsignatura: string
  periodoId: number
  nombrePeriodo: string
  valor: number
  habilitadaParaEdicion: boolean
}

export interface ResultadoImportacionNotas {
  notasCreadas: number
  notasActualizadas: number
}

export interface ErrorFilaImportacion {
  fila: number
  documento: string
  mensaje: string
}
