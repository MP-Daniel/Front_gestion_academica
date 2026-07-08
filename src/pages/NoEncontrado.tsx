import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-center">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="text-slate-500">Esta página no existe o todavía no ha sido construida.</p>
      <Link to="/login" className="font-medium text-brand-700 underline">
        Volver al inicio de sesión
      </Link>
    </div>
  )
}
