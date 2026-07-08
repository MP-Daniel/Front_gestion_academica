import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginacionProps {
  paginaActual: number
  totalPaginas: number
  onCambiarPagina: (pagina: number) => void
}

function construirPaginas(actual: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 1) return [0]

  const paginas: Array<number | 'ellipsis'> = [0]

  if (actual > 2) paginas.push('ellipsis')

  for (let p = Math.max(1, actual - 1); p <= Math.min(total - 2, actual + 1); p++) {
    paginas.push(p)
  }

  if (actual < total - 3) paginas.push('ellipsis')
  paginas.push(total - 1)

  return paginas
}

export function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }: PaginacionProps) {
  const paginas = construirPaginas(paginaActual, totalPaginas)

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={paginaActual === 0}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {paginas.map((pagina, indice) =>
        pagina === 'ellipsis' ? (
          <span key={`ellipsis-${indice}`} className="px-2 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={pagina}
            type="button"
            onClick={() => onCambiarPagina(pagina)}
            className={cn(
              'h-8 w-8 cursor-pointer rounded-lg text-sm font-medium transition',
              pagina === paginaActual
                ? 'border border-brand-600 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {pagina + 1}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Página siguiente"
        disabled={paginaActual >= totalPaginas - 1}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
