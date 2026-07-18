import { CalendarDays, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BannerBienvenidaDocenteProps {
  nombre: string
  planillasPendientes: number
}

export function BannerBienvenidaDocente({ nombre, planillasPendientes }: BannerBienvenidaDocenteProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-50 p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-100" />
      <div className="pointer-events-none absolute -right-4 bottom-[-3rem] h-32 w-32 rounded-full bg-brand-200" />

      <div className="relative max-w-xl">
        <h2 className="text-3xl font-bold text-slate-900">¡Hola, {nombre}!</h2>
        <p className="mt-3 text-slate-600">
          Tienes{' '}
          <span className="font-semibold text-brand-700">
            {planillasPendientes} {planillasPendientes === 1 ? 'planilla pendiente' : 'planillas pendientes'}
          </span>{' '}
          de calificar antes del cierre del periodo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="w-fit">
            <Button type="button">
              <PenLine size={18} />
              Calificar Ahora
            </Button>
          </div>
          <div className="w-fit">
            <Button type="button" variant="secondary">
              <CalendarDays size={18} />
              Ver Calendario
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
