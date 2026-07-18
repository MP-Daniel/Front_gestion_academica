interface BienvenidaBannerProps {
  nombre: string
  // Se mantiene el prop para posibles usos futuros, aunque el CTA de "Ver mis tareas"
  // que lo acompañaba ya se quitó del banner.
  entregasPendientes: number
}

export function BienvenidaBanner({ nombre, entregasPendientes }: BienvenidaBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-50 p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-100" />
      <div className="pointer-events-none absolute -right-4 bottom-[-3rem] h-32 w-32 rounded-full bg-brand-200" />

      <div className="relative max-w-xl">
        <h2 className="text-3xl font-bold text-slate-900">¡Hola, {nombre}!</h2>
        <p className="mt-3 text-slate-600">
          Bienvenido de nuevo a tu portal académico. Tienes{' '}
          <span className="font-semibold text-brand-700">
            {entregasPendientes} {entregasPendientes === 1 ? 'entrega pendiente' : 'entregas pendientes'}
          </span>{' '}
          para esta semana y un evento institucional próximo.
        </p>
      </div>
    </div>
  )
}
