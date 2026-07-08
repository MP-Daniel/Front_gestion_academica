export interface Asignatura {
  id: number
  nombre: string
}

export interface SolicitudAsignatura {
  nombre: string
}

export interface Grado {
  id: number
  nombre: string
  directorId: number | null
}

export interface SolicitudGrado {
  nombre: string
  directorId: number
}
