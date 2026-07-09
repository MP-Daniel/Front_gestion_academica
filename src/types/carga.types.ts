export interface CargaAcademica {
  id: number
  docenteId: number
  nombreDocente: string
  documentoDocente: string
  asignaturaId: number
  nombreAsignatura: string
  gradoId: number
  nombreGrado: string
  anioLectivo: number
}

export interface SolicitudCrearCarga {
  docenteId: number
  asignaturaId: number
  gradoId: number
  anio?: number
}

export interface SolicitudReasignarDocente {
  docenteId: number
}
