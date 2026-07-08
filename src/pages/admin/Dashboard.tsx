import { BookOpen, GraduationCap, IdCard, Plus } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'

export default function Dashboard() {
  return (
    <>
      <Navbar
        titulo="Panel de Control"
        subtitulo="Institución Educativa Agrícola Fray Isidoro"
        sistemaEnLinea
      />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>
            <p className="text-sm text-slate-500">
              Vista general del progreso académico y administrativo.
            </p>
          </div>
          <div>
            <Button>
              <Plus size={18} />
              Crear Nuevo Año Académico
            </Button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard etiqueta="Total Estudiantes" valor={0} icono={GraduationCap} color="blue" />
          <StatCard etiqueta="Docentes Activos" valor={0} icono={IdCard} color="accent" />
          <StatCard
            etiqueta="Materias"
            valor={0}
            pista="12 Grados en total"
            icono={BookOpen}
            color="brand"
          />
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>
    </>
  )
}
