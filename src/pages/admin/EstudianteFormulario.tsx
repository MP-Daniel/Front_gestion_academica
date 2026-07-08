import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, IdCard, Pencil, Plus, Save } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { actualizarEstudiante, crearEstudiante, obtenerEstudiante } from '@/api/estudiantes.api'
import { extraerMensajeError } from '@/api/axios'
import type { Estudiante } from '@/types/estudiante.types'

function crearEsquemaEstudiante(esEdicion: boolean) {
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

type EstudianteFormValues = z.infer<ReturnType<typeof crearEsquemaEstudiante>>

export default function EstudianteFormulario() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const esEdicion = Boolean(id)

  const [estudianteCargado, setEstudianteCargado] = useState<Estudiante | null>(null)
  const [cargando, setCargando] = useState(esEdicion)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EstudianteFormValues>({ resolver: zodResolver(crearEsquemaEstudiante(esEdicion)) })

  useEffect(() => {
    if (!id) return
    let vigente = true

    obtenerEstudiante(Number(id))
      .then((estudiante) => {
        if (!vigente) return
        setEstudianteCargado(estudiante)
        reset({
          primerNombre: estudiante.primerNombre,
          segundoNombre: estudiante.segundoNombre ?? '',
          primerApellido: estudiante.primerApellido,
          segundoApellido: estudiante.segundoApellido ?? '',
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

  const onSubmit = async (valores: EstudianteFormValues) => {
    setErrorEnvio(null)
    try {
      if (esEdicion && estudianteCargado) {
        await actualizarEstudiante(estudianteCargado.id, {
          primerNombre: valores.primerNombre,
          segundoNombre: valores.segundoNombre || undefined,
          primerApellido: valores.primerApellido,
          segundoApellido: valores.segundoApellido || undefined,
        })
      } else {
        await crearEstudiante({
          primerNombre: valores.primerNombre,
          segundoNombre: valores.segundoNombre || undefined,
          primerApellido: valores.primerApellido,
          segundoApellido: valores.segundoApellido || undefined,
          documento: valores.documento ?? '',
          email: valores.email ?? '',
          contrasena: valores.contrasena ?? '',
        })
      }
      navigate('/admin/estudiantes')
    } catch (error) {
      setErrorEnvio(extraerMensajeError(error))
    }
  }

  return (
    <>
      <Navbar
        titulo="Gestión de Estudiantes"
        subtitulo={esEdicion ? 'Estudiantes › Editar estudiante' : 'Estudiantes › Agregar estudiante'}
      />

      <main className="flex-1 p-8">
        <Link
          to="/admin/estudiantes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} />
          Volver al listado de estudiantes
        </Link>

        <div className="mt-4 flex items-center gap-2">
          {esEdicion ? (
            <Pencil className="text-brand-600" size={22} />
          ) : (
            <Plus className="text-brand-600" size={26} />
          )}
          <h1 className="text-2xl font-bold text-slate-900">
            {esEdicion ? 'Editando estudiante' : 'Agregando estudiante'}
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {esEdicion
            ? 'Actualice el nombre del estudiante. El documento y el correo no se pueden modificar desde aquí.'
            : 'Complete la información personal para registrar un nuevo estudiante.'}
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
                <Input label="Número de Documento" value={estudianteCargado?.documento ?? ''} disabled />
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
                <Button type="button" variant="secondary" onClick={() => navigate('/admin/estudiantes')}>
                  Cancelar
                </Button>
              </div>
              <div>
                <Button type="submit" isLoading={isSubmitting}>
                  <Save size={18} />
                  {esEdicion ? 'Guardar cambios' : 'Guardar estudiante'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos
        los derechos reservados.
      </footer>
    </>
  )
}
