import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, GraduationCap, Pencil, Search, Trash2, UserPlus, UserCheck, UserX } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import { Paginacion } from '@/components/ui/Paginacion'
import { TarjetaResumen } from '@/components/ui/TarjetaResumen'
import { Spinner } from '@/components/ui/Spinner'
import { DialogoConfirmacion } from '@/components/ui/DialogoConfirmacion'
import { activarDocente, desactivarDocente, eliminarDocente, listarDocentes } from '@/api/docentes.api'
import { extraerMensajeError } from '@/api/axios'
import { nombreCompleto } from '@/lib/utils'
import type { Docente } from '@/types/docente.types'
import type { PaginaSpring } from '@/types/api.types'

const TAMANO_PAGINA = 5

const PALETA_MATERIAS: BadgeColor[] = ['blue', 'accent', 'pink', 'purple', 'brand', 'cyan', 'orange', 'indigo']

function colorPorTexto(texto: string): BadgeColor {
  const hash = [...texto].reduce((acumulado, caracter) => acumulado + caracter.charCodeAt(0), 0)
  return PALETA_MATERIAS[hash % PALETA_MATERIAS.length]
}

export default function Docentes() {
  const navigate = useNavigate()
  const [pagina, setPagina] = useState(0)
  const [resultado, setResultado] = useState<PaginaSpring<Docente> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recarga, setRecarga] = useState(0)

  const [docenteAEliminar, setDocenteAEliminar] = useState<Docente | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  const [docenteACambiarEstado, setDocenteACambiarEstado] = useState<Docente | null>(null)
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [errorCambiarEstado, setErrorCambiarEstado] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    setError(null)

    listarDocentes({ pagina, tamanoPagina: TAMANO_PAGINA })
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
    if (!docenteAEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminarDocente(docenteAEliminar.id)
      setDocenteAEliminar(null)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorEliminar(extraerMensajeError(error))
    } finally {
      setEliminando(false)
    }
  }

  const confirmarCambioEstado = async () => {
    if (!docenteACambiarEstado) return
    setCambiandoEstado(true)
    setErrorCambiarEstado(null)
    try {
      if (docenteACambiarEstado.activo) {
        await desactivarDocente(docenteACambiarEstado.id)
      } else {
        await activarDocente(docenteACambiarEstado.id)
      }
      setDocenteACambiarEstado(null)
      setRecarga((valor) => valor + 1)
    } catch (error) {
      setErrorCambiarEstado(extraerMensajeError(error))
    } finally {
      setCambiandoEstado(false)
    }
  }

  const docentes = resultado?.content ?? []
  const activosEnPagina = docentes.filter((docente) => docente.activo).length
  const desde = resultado ? resultado.page.number * resultado.page.size + 1 : 0
  const hasta = resultado ? Math.min(desde + docentes.length - 1, resultado.page.totalElements) : 0

  return (
    <>
      <Navbar titulo="Gestión de Docentes" />

      <main className="flex-1 p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, documento o especialidad..."
              icon={<Search size={18} />}
              disabled
            />
            <p className="mt-1 text-xs text-slate-400">
              Búsqueda en desarrollo — próximamente disponible.
            </p>
          </div>
          <div className="shrink-0">
            <Button onClick={() => navigate('/admin/docentes/nuevo')}>
              <UserPlus size={18} />
              Registrar Nuevo Docente
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
                  <th className="px-6 py-3">Materias</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docentes.map((docente) => {
                  const nombre = nombreCompleto(docente)

                  return (
                    <tr key={docente.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar nombre={nombre} tamano="md" />
                          <div>
                            <p className="font-medium text-slate-900">{nombre}</p>
                            <p className="text-xs text-slate-500">{docente.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">CC {docente.documento}</p>
                      </td>
                      <td className="px-6 py-4">
                        {docente.materias.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {docente.materias.map((materia) => (
                              <Badge key={materia} color={colorPorTexto(materia)}>
                                {materia}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">Sin materias asignadas</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={docente.activo ? 'brand' : 'red'}>
                          {docente.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            aria-label={`Editar ${nombre}`}
                            title="Editar"
                            onClick={() => navigate(`/admin/docentes/${docente.id}/editar`)}
                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`${docente.activo ? 'Desactivar' : 'Activar'} ${nombre}`}
                            title={docente.activo ? 'Desactivar' : 'Activar'}
                            onClick={() => setDocenteACambiarEstado(docente)}
                            className={`cursor-pointer ${docente.activo ? 'text-amber-500 hover:text-amber-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                          >
                            {docente.activo ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar ${nombre}`}
                            title="Eliminar"
                            onClick={() => setDocenteAEliminar(docente)}
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
              Mostrando {desde} a {hasta} de {resultado.page.totalElements} docentes
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
            valor={docentes.length}
            etiqueta="Docentes"
            descripcion="Total en esta página"
            icono={GraduationCap}
            color="accent"
          />
          <TarjetaResumen
            valor={activosEnPagina}
            etiqueta="Activos"
            descripcion="En ejercicio actual"
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
        abierto={Boolean(docenteACambiarEstado)}
        titulo={docenteACambiarEstado?.activo ? 'Desactivar docente' : 'Activar docente'}
        mensaje={
          docenteACambiarEstado
            ? docenteACambiarEstado.activo
              ? `¿Seguro que deseas desactivar a ${nombreCompleto(docenteACambiarEstado)}? Su registro se conserva, pero quedará marcado como inactivo y no podrá iniciar sesión.`
              : `¿Seguro que deseas reactivar a ${nombreCompleto(docenteACambiarEstado)}? Podrá volver a iniciar sesión en el sistema.`
            : ''
        }
        error={errorCambiarEstado ?? undefined}
        procesando={cambiandoEstado}
        textoConfirmar={docenteACambiarEstado?.activo ? 'Desactivar' : 'Activar'}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => {
          setDocenteACambiarEstado(null)
          setErrorCambiarEstado(null)
        }}
      />

      <DialogoConfirmacion
        abierto={Boolean(docenteAEliminar)}
        titulo="Eliminar docente"
        mensaje={
          docenteAEliminar
            ? `¿Seguro que deseas eliminar permanentemente a ${nombreCompleto(docenteAEliminar)}? Esta acción no se puede deshacer. (Debe estar inactivo y no tener cargas académicas).`
            : ''
        }
        error={errorEliminar ?? undefined}
        procesando={eliminando}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => {
          setDocenteAEliminar(null)
          setErrorEliminar(null)
        }}
      />
    </>
  )
}
