import { api } from './axios'
import type { Institucion, SolicitudActualizarInstitucion } from '@/types/institucion.types'

export const obtenerInstitucion = () => {
  return api.get<Institucion>('/institucion')
}

export const actualizarInstitucion = (datos: SolicitudActualizarInstitucion) => {
  return api.put<Institucion>('/institucion', datos)
}

export const subirSelloInstitucion = (archivo: File) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/sello', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const subirLogoInstitucion = (archivo: File) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const subirFirmaRector = (archivo: File) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/firma', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const subirBanderaInstitucion = (archivo: File) => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/bandera', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
