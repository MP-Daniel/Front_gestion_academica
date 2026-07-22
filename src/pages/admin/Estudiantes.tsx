import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, GraduationCap, Pencil, Search, Trash2, UserPlus, UserCheck, UserX } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import { Paginacion } from '@/components/ui/Paginacion'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { Spinner } from '@/components/ui/Spinner'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { activarEstudiante, desactivarEstudiante, eliminarEstudiante, listarEstudiantes } from '@/api/estudiantes.api'
import { extraerMensajeError } from '@/api/axios'
import { useAnioLectivo } from '@/hooks/useAnioLectivo'
import { nombreCompleto } from '@/lib/utils'
import type { Estudiante } from '@/types/estudiante.types'
import type { EstadoMatricula } from '@/types/matricula.types'
import type { PaginaSpring } from '@/types/api.types'

const TAMANO_PAGINA = 10

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

export default function Estudiantes() {
  const navigate = useNavigate()
  const { soloLectura } = useAnioLectivo()
  const [pagina, setPagina] = useState(0)
  const [resultado, setResultado] = useState<PaginaSpring<Estudiante> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recarga, setRecarga] = useState(0)

  const [estudianteAEliminar, setEstudianteAEliminar] = useState<Estudiante | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  const [estudianteACambiarEstado, setEstudianteACambiarEstado] = useState<Estudiante | null>(null)
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [errorCambiarEstado, setErrorCambiarEstado] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    setError(null)

    listarEstudiantes({ pagina, tamanoPagina: TAMANO_PAGINA })
      .then((datos) => {
        if (vigente) setResultado(datos)
      })
      .catch((error: unknown) => {
        if (vigente) setError(extraerMensajeError(error))
      })

    return () => {
      vigente = false
    }
  }, [pagina, recarga])

  const confirmarEliminacion = async () => {
    if (!estudianteAEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminarEstudiante(estudianteAEliminar.id)
      setEstudianteAEliminar(null)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorEliminar(extraerMensajeError(error))
    } finally {
      setEliminando(false)
    }
  }

  const confirmarCambioEstado = async () => {
    if (!estudianteACambiarEstado) return
    setCambiandoEstado(true)
    setErrorCambiarEstado(null)
    try {
      if (estudianteACambiarEstado.activo) {
        await desactivarEstudiante(estudianteACambiarEstado.id)
      } else {
        await activarEstudiante(estudianteACambiarEstado.id)
      }
      setEstudianteACambiarEstado(null)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorCambiarEstado(extraerMensajeError(error))
    } finally {
      setCambiandoEstado(false)
    }
  }

  const estudiantes = resultado?.content ?? []
  const activosEnPagina = estudiantes.filter((estudiante) => estudiante.activo).length
  const desde = resultado ? resultado.page.number * resultado.page.size + 1 : 0
  const hasta = resultado ? Math.min(desde + estudiantes.length - 1, resultado.page.totalElements) : 0

  return (
    <>
      <Navbar titulo="Gestión de Estudiantes" />

      <main className="flex-1 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Input placeholder="Buscar por nombre o documento..." icon={<Search size={18} />} disabled />
            <p className="mt-1 text-xs text-slate-400">Búsqueda en desarrollo — próximamente disponible.</p>
          </div>
          <div className="shrink-0">
            <Button onClick={() => navigate('/admin/estudiantes/nuevo')}>
              <UserPlus size={18} />
              Nuevo Estudiante
            </Button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <p className="p-8 text-center text-sm text-red-500">{error}</p>
          ) : !resultado ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-6 py-3">Nombre completo</th>
                  <th className="px-6 py-3">Identificación</th>
                  <th className="px-6 py-3">Curso</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estudiantes.map((estudiante) => {
                  const nombre = nombreCompleto(estudiante)

                  return (
                    <tr key={estudiante.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar nombre={nombre} tamano="md" />
                          <p className="font-medium text-slate-900">{nombre}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">CC {estudiante.documento}</p>
                      </td>
                      <td className="px-6 py-4">
                        {soloLectura ? (
                          <p className="text-xs text-slate-400">No disponible para años anteriores</p>
                        ) : estudiante.gradoActualNombre ? (
                          <Badge color="blue">{estudiante.gradoActualNombre}</Badge>
                        ) : estudiante.ultimaMatriculaGrado && estudiante.ultimaMatriculaEstado ? (
                          <div className="flex items-center gap-1.5">
                            <Badge color="slate">{estudiante.ultimaMatriculaGrado}</Badge>
                            <Badge color={COLOR_ESTADO[estudiante.ultimaMatriculaEstado]}>
                              {estudiante.ultimaMatriculaEstado}
                            </Badge>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">Sin matricular</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={estudiante.activo ? 'brand' : 'red'}>
                          {estudiante.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            aria-label={`Ver perfil de ${nombre}`}
                            title="Ver perfil"
                            onClick={() => navigate(`/admin/estudiantes/${estudiante.id}/perfil`)}
                            className="cursor-pointer text-slate-500 hover:text-slate-700"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Editar ${nombre}`}
                            title="Editar"
                            onClick={() => navigate(`/admin/estudiantes/${estudiante.id}/editar`)}
                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`${estudiante.activo ? 'Desactivar' : 'Activar'} ${nombre}`}
                            title={estudiante.activo ? 'Desactivar' : 'Activar'}
                            onClick={() => setEstudianteACambiarEstado(estudiante)}
                            className={`cursor-pointer ${estudiante.activo ? 'text-amber-500 hover:text-amber-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                          >
                            {estudiante.activo ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar ${nombre}`}
                            title="Eliminar"
                            onClick={() => setEstudianteAEliminar(estudiante)}
                            className="cursor-pointer text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {resultado && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Mostrando {desde} a {hasta} de {resultado.page.totalElements} estudiantes
            </p>
            <Paginacion
              paginaActual={resultado.page.number}
              totalPaginas={resultado.page.totalPages}
              onCambiarPagina={setPagina}
            />
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TarjetaResumen
            valor={estudiantes.length}
            etiqueta="Estudiantes"
            descripcion="Total en esta página"
            icono={GraduationCap}
            color="accent"
          />
          <TarjetaResumen
            valor={activosEnPagina}
            etiqueta="Activos"
            descripcion="En esta página"
            icono={CheckCircle2}
            color="brand"
          />
        </div>
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>

      <DialogoConfirmacion
        abierto={Boolean(estudianteACambiarEstado)}
        titulo={estudianteACambiarEstado?.activo ? 'Desactivar estudiante' : 'Activar estudiante'}
        mensaje={
          estudianteACambiarEstado
            ? estudianteACambiarEstado.activo
              ? `¿Seguro que deseas desactivar a ${nombreCompleto(estudianteACambiarEstado)}? Su registro se conserva, pero quedará marcado como inactivo y no podrá iniciar sesión.`
              : `¿Seguro que deseas reactivar a ${nombreCompleto(estudianteACambiarEstado)}? Podrá volver a iniciar sesión en el sistema.`
            : ''
        }
        error={errorCambiarEstado ?? undefined}
        procesando={cambiandoEstado}
        textoConfirmar={estudianteACambiarEstado?.activo ? 'Desactivar' : 'Activar'}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => {
          setEstudianteACambiarEstado(null)
          setErrorCambiarEstado(null)
        }}
      />

      <DialogoConfirmacion
        abierto={Boolean(estudianteAEliminar)}
        titulo="Eliminar estudiante"
        mensaje={
          estudianteAEliminar
            ? `¿Seguro que deseas eliminar permanentemente a ${nombreCompleto(estudianteAEliminar)}? Esta acción no se puede deshacer. (Debe estar inactivo y no tener matrículas ni notas).`
            : ''
        }
        error={errorEliminar ?? undefined}
        procesando={eliminando}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => {
          setEstudianteAEliminar(null)
          setErrorEliminar(null)
        }}
      />
    </>
  )
}
