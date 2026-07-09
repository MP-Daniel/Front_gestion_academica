import { useEffect, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, IdCard, PenLine, Pencil, Plus, Save, Upload } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import {
  actualizarDocente,
  actualizarFirmaDocente,
  crearDocente,
  obtenerDocente,
} from '@/api/docentes.api'
import { extraerMensajeError } from '@/api/axios'
import { urlBackend } from '@/lib/utils'
import type { Docente } from '@/types/docente.types'

function crearEsquemaDocente(esEdicion: boolean) {
  return z
    .object({
      primerNombre: z.string().min(1, 'El primer nombre es obligatorio').max(50),
      segundoNombre: z.string().max(50).optional(),
      primerApellido: z.string().min(1, 'El primer apellido es obligatorio').max(50),
      segundoApellido: z.string().max(50).optional(),
      documento: z.string().max(50).optional(),
      email: z.string().max(150).optional(),
      contrasena: z.string().optional(),
    })
    .superRefine((valores, ctx) => {
      if (esEdicion) return

      if (!valores.documento) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['documento'], message: 'El documento es obligatorio' })
      }
      if (!valores.email) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: 'El correo es obligatorio' })
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: 'Correo inválido' })
      }
      if (!valores.contrasena || valores.contrasena.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contrasena'],
          message: 'La contraseña debe tener mínimo 8 caracteres',
        })
      }
    })
}

type DocenteFormValues = z.infer<ReturnType<typeof crearEsquemaDocente>>

export default function DocenteFormulario() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const esEdicion = Boolean(id)

  const [docenteCargado, setDocenteCargado] = useState<Docente | null>(null)
  const [cargando, setCargando] = useState(esEdicion)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)

  const [archivoFirma, setArchivoFirma] = useState<File | null>(null)
  const [previewFirma, setPreviewFirma] = useState<string | null>(null)
  const [subiendoFirma, setSubiendoFirma] = useState(false)
  const [errorFirma, setErrorFirma] = useState<string | null>(null)
  const [firmaImagenFallo, setFirmaImagenFallo] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocenteFormValues>({ resolver: zodResolver(crearEsquemaDocente(esEdicion)) })

  useEffect(() => {
    if (!id) return
    let vigente = true

    obtenerDocente(Number(id))
      .then((docente) => {
        if (!vigente) return
        setDocenteCargado(docente)
        reset({
          primerNombre: docente.primerNombre,
          segundoNombre: docente.segundoNombre ?? '',
          primerApellido: docente.primerApellido,
          segundoApellido: docente.segundoApellido ?? '',
        })
      })
      .catch((error: unknown) => {
        if (vigente) setErrorCarga(extraerMensajeError(error))
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [id, reset])

  const onSubmit = async (valores: DocenteFormValues) => {
    setErrorEnvio(null)
    try {
      if (esEdicion && docenteCargado) {
        await actualizarDocente(docenteCargado.id, {
          primerNombre: valores.primerNombre,
          segundoNombre: valores.segundoNombre || undefined,
          primerApellido: valores.primerApellido,
          segundoApellido: valores.segundoApellido || undefined,
        })
      } else {
        await crearDocente({
          primerNombre: valores.primerNombre,
          segundoNombre: valores.segundoNombre || undefined,
          primerApellido: valores.primerApellido,
          segundoApellido: valores.segundoApellido || undefined,
          documento: valores.documento ?? '',
          email: valores.email ?? '',
          contrasena: valores.contrasena ?? '',
        })
      }
      navigate('/admin/docentes')
    } catch (error) {
      setErrorEnvio(extraerMensajeError(error))
    }
  }

  const manejarSeleccionFirma = (evento: ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) return
    setArchivoFirma(archivo)
    setPreviewFirma(URL.createObjectURL(archivo))
    setErrorFirma(null)
    setFirmaImagenFallo(false)
  }

  const subirFirma = async () => {
    if (!archivoFirma || !docenteCargado) return
    setSubiendoFirma(true)
    setErrorFirma(null)
    try {
      const actualizado = await actualizarFirmaDocente(docenteCargado.id, archivoFirma)
      setDocenteCargado(actualizado)
      setArchivoFirma(null)
    } catch (error) {
      setErrorFirma(extraerMensajeError(error))
    } finally {
      setSubiendoFirma(false)
    }
  }

  return (
    <>
      <Navbar
        titulo="Gestión de Docentes"
        subtitulo={esEdicion ? 'Docentes › Editar docente' : 'Docentes › Agregar docente'}
      />

      <main className="flex-1 p-8">
        <Link
          to="/admin/docentes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} />
          Volver al listado de docentes
        </Link>

        <div className="mt-4 flex items-center gap-2">
          {esEdicion ? (
            <Pencil className="text-brand-600" size={22} />
          ) : (
            <Plus className="text-brand-600" size={26} />
          )}
          <h1 className="text-2xl font-bold text-slate-900">
            {esEdicion ? 'Editando docente' : 'Agregando docente'}
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {esEdicion
            ? 'Actualice el nombre del docente. El documento y el correo no se pueden modificar desde aquí.'
            : 'Complete la información personal para registrar un nuevo docente.'}
        </p>

        {errorCarga ? (
          <p className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500">
            {errorCarga}
          </p>
        ) : cargando ? (
          <div className="mt-6 flex justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner />
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
              noValidate
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                  <IdCard size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Datos Personales</h2>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Primer Nombre"
                  placeholder="Escriba el primer nombre"
                  error={errors.primerNombre?.message}
                  {...register('primerNombre')}
                />
                <Input
                  label="Segundo Nombre"
                  placeholder="Escriba el segundo nombre (opcional)"
                  error={errors.segundoNombre?.message}
                  {...register('segundoNombre')}
                />
                <Input
                  label="Primer Apellido"
                  placeholder="Escriba el primer apellido"
                  error={errors.primerApellido?.message}
                  {...register('primerApellido')}
                />
                <Input
                  label="Segundo Apellido"
                  placeholder="Escriba el segundo apellido (opcional)"
                  error={errors.segundoApellido?.message}
                  {...register('segundoApellido')}
                />

                {esEdicion ? (
                  <>
                    <Input label="Número de Documento" value={docenteCargado?.documento ?? ''} disabled />
                    <Input label="Correo Institucional" value={docenteCargado?.email ?? ''} disabled />
                  </>
                ) : (
                  <>
                    <Input
                      label="Número de Documento"
                      placeholder="Escriba el número de identificación"
                      error={errors.documento?.message}
                      {...register('documento')}
                    />
                    <Input
                      label="Correo Institucional"
                      placeholder="e.j. instituto.edu.co"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </>
                )}

                {!esEdicion && (
                  <div className="sm:col-span-2">
                    <Input
                      label="Contraseña Inicial"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      error={errors.contrasena?.message}
                      {...register('contrasena')}
                    />
                  </div>
                )}
              </div>

              {errorEnvio && <p className="mt-4 text-sm text-red-500">{errorEnvio}</p>}

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <div>
                  <Button type="button" variant="secondary" onClick={() => navigate('/admin/docentes')}>
                    Cancelar
                  </Button>
                </div>
                <div>
                  <Button type="submit" isLoading={isSubmitting}>
                    <Save size={18} />
                    {esEdicion ? 'Guardar cambios' : 'Guardar docente'}
                  </Button>
                </div>
              </div>
            </form>

            {esEdicion && docenteCargado && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <PenLine size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Firma del Docente</h2>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  {(previewFirma || docenteCargado.firmaUrl) && !firmaImagenFallo ? (
                    <img
                      src={previewFirma ?? urlBackend(docenteCargado.firmaUrl ?? '')}
                      alt="Firma del docente"
                      className="h-20 w-40 rounded-lg border border-slate-200 bg-white object-contain"
                      onError={() => setFirmaImagenFallo(true)}
                    />
                  ) : (
                    <div className="flex h-20 w-40 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                      Sin firma
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Upload size={16} />
                      Elegir imagen
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={manejarSeleccionFirma}
                      />
                    </label>
                    {archivoFirma && (
                      <Button type="button" variant="secondary" isLoading={subiendoFirma} onClick={subirFirma}>
                        Guardar firma
                      </Button>
                    )}
                  </div>
                </div>

                {errorFirma && <p className="mt-3 text-sm text-red-500">{errorFirma}</p>}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>
    </>
  )
}
