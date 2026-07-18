export interface EventoInstitucional {
  id: number
  titulo: string
  descripcion: string
  fecha: string
  lugar: string | null
}

export interface SolicitudCrearEvento {
  titulo: string
  descripcion: string
  fecha: string
  lugar: string | null
}
