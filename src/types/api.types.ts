// Interfaces estructurales para manejar las respuestas genéricas o paginadas del backend Spring Boot

export interface PaginaSpring<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// Forma estándar de error de la API (ver esquema RespuestaError en Swagger)
export interface ErrorApi {
  error: string
  mensaje: string
  timestamp: string
}

// Forma de error para fallos de validación (400): mensaje por campo en vez de "mensaje" único
export interface ErrorValidacion {
  error: string
  campos: Record<string, string>
  timestamp: string
}
