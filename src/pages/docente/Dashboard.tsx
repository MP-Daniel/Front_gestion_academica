import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function Dashboard() {
  const { usuario, cerrarSesion } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white">
      <h1 className="text-2xl font-bold text-slate-900">Panel de Docente</h1>
      <p className="text-slate-500">Bienvenido, {usuario?.nombre}</p>
      <div className="w-40">
        <Button variant="secondary" onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
