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
  notaDefinitiva: number | null
}

export interface Nota {
  id: number | null
  matriculaId: number
  documentoEstudiante: string
  nombreEstudiante: string
  cargaAcademicaId: number
  nombreAsignatura: string
  periodoId: number
  nombrePeriodo: string
  valor: number | null
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

export interface FilaPreviewImportacion {
  documento: string
  nombreEstudiante: string
  notaActual: number | null
  notaNueva: number
  actualizacion: boolean
}

export interface ResultadoPreviewImportacion {
  filas: FilaPreviewImportacion[]
  totalCreaciones: number
  totalActualizaciones: number
}
