export type EstadoMatricula = 'ACTIVA' | 'RETIRADA' | 'PROMOVIDA' | 'REPROBADA'

export interface Matricula {
  id: number
  estudianteId: number
  documentoEstudiante: string
  nombreCompletoEstudiante: string
  nombreGrado: string
  anioLectivo: number
  estado: EstadoMatricula
}

export interface SolicitudCrearMatricula {
  documentoEstudiante: string
  gradoId: number
  anio?: number
}

export interface SolicitudCambiarEstado {
  nuevoEstado: EstadoMatricula
}
