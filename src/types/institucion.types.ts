export interface Institucion {
  id: number
  nombre: string
  nit: string
  codigoDane: string
  resolucion: string
  selloUrl: string | null
  logoUrl: string | null
  firmaRectorUrl: string | null
  banderaUrl: string | null
  direccion: string
  nombreRector: string
}

export interface SolicitudActualizarInstitucion {
  nombre: string
  nit: string
  codigoDane: string
  resolucion: string
  direccion: string
  nombreRector: string
}
