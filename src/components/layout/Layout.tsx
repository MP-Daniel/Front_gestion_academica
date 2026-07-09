import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'

export function Layout() {
  const cargarAnios = useAnioLectivo().cargarAnios

  useEffect(() => {
    cargarAnios()
  }, [cargarAnios])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
