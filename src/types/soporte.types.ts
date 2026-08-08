export type CategoriaSoporte = 'PROBLEMA_TECNICO' | 'DUDA_ACADEMICA' | 'OTRO'

export type EstadoSolicitudSoporte = 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA'

export interface SolicitudSoporte {
  id: number
  asunto: string
  descripcion: string
  categoria: CategoriaSoporte
  estado: EstadoSolicitudSoporte
  respuestaAdmin: string | null
  nombreSolicitante: string
  documentoSolicitante: string
  rolSolicitante: string
  fechaCreacion: string
  fechaActualizacion: string | null
}

export interface SolicitudCrearSoporte {
  asunto: string
  descripcion: string
  categoria: CategoriaSoporte
}

export interface SolicitudActualizarEstadoSoporte {
  estado: EstadoSolicitudSoporte
  respuestaAdmin?: string
}
