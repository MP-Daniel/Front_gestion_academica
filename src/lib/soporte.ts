import type { BadgeColor } from '@/components/ui/Badge'
import type { CategoriaSoporte, EstadoSolicitudSoporte } from '@/types/soporte.types'

export const ETIQUETA_CATEGORIA: Record<CategoriaSoporte, string> = {
  PROBLEMA_TECNICO: 'Problema técnico',
  DUDA_ACADEMICA: 'Duda académica',
  OTRO: 'Otro',
}

export const COLOR_CATEGORIA: Record<CategoriaSoporte, BadgeColor> = {
  PROBLEMA_TECNICO: 'red',
  DUDA_ACADEMICA: 'purple',
  OTRO: 'slate',
}

export const ETIQUETA_ESTADO: Record<EstadoSolicitudSoporte, string> = {
  ABIERTA: 'Abierta',
  EN_PROCESO: 'En proceso',
  RESUELTA: 'Resuelta',
}

export const COLOR_ESTADO: Record<EstadoSolicitudSoporte, BadgeColor> = {
  ABIERTA: 'orange',
  EN_PROCESO: 'blue',
  RESUELTA: 'brand',
}
