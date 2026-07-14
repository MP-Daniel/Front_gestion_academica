import { useAuth } from '@/hooks/useAuth'
import { nombreCompleto } from '@/lib/utils'
import { NavbarDocente } from '@/components/layout/NavbarDocente'
import { BannerBienvenidaDocente } from '@/components/docente/BannerBienvenidaDocente'
import { CargaAcademica, type ClaseHoy } from '@/components/docente/CargaAcademica'
import { CierrePeriodo } from '@/components/docente/CierrePeriodo'
import { AlertasSeguimiento, type EstudianteAlerta } from '@/components/docente/AlertasSeguimiento'

// Datos de ejemplo: esta vista todavía no está conectada al backend.
const CLASES_DE_HOY: ClaseHoy[] = [
  { id: 1, hora: '07:00 - 08:30', asignatura: 'Matemáticas', grado: '11°A', cantidadEstudiantes: 28 },
  { id: 2, hora: '08:30 - 10:00', asignatura: 'Matemáticas', grado: '10°B', cantidadEstudiantes: 25 },
  { id: 3, hora: '10:30 - 12:00', asignatura: 'Geometría', grado: '11°B', cantidadEstudiantes: 30 },
]

const ESTUDIANTES_EN_ALERTA: EstudianteAlerta[] = [
  { id: 1, nombre: 'Camila Torres', grado: '11°A', estado: 'RIESGO_DESERCION' },
  { id: 2, nombre: 'Santiago Ríos', grado: '10°B', estado: 'BAJO_RENDIMIENTO' },
  { id: 3, nombre: 'Valentina Gómez', grado: '11°B', estado: 'BAJO_RENDIMIENTO' },
]

export default function Dashboard() {
  const { usuario } = useAuth()

  if (!usuario) return null

  return (
    <>
      <NavbarDocente usuario={usuario} cargo="Docente de Matemáticas" seccionActual="Inicio" />

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <BannerBienvenidaDocente nombre={nombreCompleto(usuario)} planillasPendientes={5} />
            <CargaAcademica clases={CLASES_DE_HOY} />
            <AlertasSeguimiento estudiantes={ESTUDIANTES_EN_ALERTA} />
          </div>

          <div className="flex flex-col gap-6">
            <CierrePeriodo
              nombrePeriodo="Periodo 2"
              porcentajeCompletado={68}
              diasRestantes={6}
              planillasSinCalificar={5}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los
        derechos reservados.
      </footer>
    </>
  )
}
