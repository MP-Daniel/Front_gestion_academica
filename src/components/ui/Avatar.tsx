import { cn } from '@/lib/utils'

interface AvatarProps {
  nombre: string
  tamano?: 'sm' | 'md'
}

const TAMANOS = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
} as const

export function Avatar({ nombre, tamano = 'sm' }: AvatarProps) {
  const iniciales = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white',
        TAMANOS[tamano],
      )}
    >
      {iniciales}
    </div>
  )
}
