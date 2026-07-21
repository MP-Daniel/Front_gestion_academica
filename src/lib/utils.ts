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

// El backend serializa LocalTime como "HH:mm:ss"; la UI solo necesita "HH:mm".
export function formatearHora(hora: string): string {
  return hora.slice(0, 5)
}

// Mismo umbral en toda la app: >=3.5 aprobado, >=3.0 básico, el resto bajo.
export function estiloNotaFinal(valor: number): string {
  if (valor >= 3.5) return 'bg-brand-50 text-brand-700 border-brand-200'
  if (valor >= 3.0) return 'bg-accent-100 text-accent-700 border-accent-300'
  return 'bg-red-50 text-red-600 border-red-200'
}
