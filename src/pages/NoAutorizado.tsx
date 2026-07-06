import { Link } from 'react-router-dom'

export default function NoAutorizado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-center">
      <h1 className="text-4xl font-bold text-slate-800">403</h1>
      <p className="text-slate-500">No tienes permisos para acceder a esta sección.</p>
      <Link to="/login" className="font-medium text-green-700 underline">
        Volver al inicio de sesión
      </Link>
    </div>
  )
}
