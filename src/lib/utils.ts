import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

interface PersonaConNombre {
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
}

export function nombreCompleto(persona: PersonaConNombre): string {
  return [persona.primerNombre, persona.segundoNombre, persona.primerApellido, persona.segundoApellido]
    .filter(Boolean)
    .join(' ')
}

export function urlBackend(ruta: string): string {
  if (/^https?:\/\//.test(ruta)) return ruta
  const base = (import.meta.env.VITE_BACKEND_API as string).replace(/\/api\/?$/, '')
  return `${base}${ruta}`
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

export function formatearFechaCorta(fechaIso: string): { dia: number; mes: string } {
  const fecha = new Date(fechaIso)
  return { dia: fecha.getDate(), mes: MESES[fecha.getMonth()] }
}
