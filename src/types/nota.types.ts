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
