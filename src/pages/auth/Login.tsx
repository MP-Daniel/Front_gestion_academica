import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, Lock, User } from 'lucide-react'
import logoIe from '@/assets/logo-ie-descanse.png'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import { login as loginApi } from '@/api/auth.api'
import { extraerMensajeError } from '@/api/axios'
import type { Rol } from '@/types/auth.types'

const RUTAS_POR_ROL: Record<Rol, string> = {
  ADMIN: '/admin',
  DOCENTE: '/docente',
  ESTUDIANTE: '/estudiante',
}

const loginSchema = z.object({
  documento: z.string().min(1, 'Ingresa tu número de documento'),
  contrasena: z.string().min(1, 'Ingresa tu contraseña'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const setSesion = useAuthStore((state) => state.setSesion)
  const [errorLogin, setErrorLogin] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormValues) => {
    setErrorLogin(null)
    setEnviando(true)
    try {
      const sesion = await loginApi(data)
      setSesion(sesion.token, sesion.usuario)
      navigate(RUTAS_POR_ROL[sesion.usuario.rol])
    } catch (error) {
      setErrorLogin(extraerMensajeError(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <img src={logoIe} alt="Escudo IE Agrícola Fray Isidoro de Montclar" className="h-10 w-10 p-1 rounded-full" />
          <span className="font-bold text-brand-700">
            IE Agrícola Fray Isidoro de Montclar
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <button
            type="button"
            aria-label="Ayuda"
            className="cursor-pointer rounded-full p-1.5 hover:bg-slate-100"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col">
          <div className="h-[38%] bg-[#dfeee4]" />
          <div className="h-[32%] bg-[#f5f0dd]" />
          <div className="h-[30%] bg-[#dde3ee]" />
        </div>

        <div className="w-full max-w-md rounded-2xl border-t-4 border-brand-600 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white ring-4 ring-brand-100">
              <img
                src={logoIe}
                alt="Escudo IE Agrícola Fray Isidoro de Montclar"
                className="h-24 w-24 object-contain"
              />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Bienvenido</h1>
            <p className="mt-1 text-sm text-slate-500">
              Plataforma de Gestión Académica
            </p>
            <span className="mt-3 h-1 w-10 rounded-full bg-accent-400" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
            <Input
              label="Documento"
              placeholder="Número de documento"
              icon={<User size={18} />}
              error={errors.documento?.message}
              {...register('documento')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="········"
              icon={<Lock size={18} />}
              error={errors.contrasena?.message}
              {...register('contrasena')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                />
                Recordarme
              </label>
              <a href="#" className="font-medium text-blue-600 hover:underline">
                ¿Olvidó su contraseña?
              </a>
            </div>

            {errorLogin && <p className="text-sm text-red-500">{errorLogin}</p>}

            <Button type="submit" isLoading={enviando}>
              Ingresar a la Plataforma
            </Button>
          </form>
        </div>
      </main>

      <footer className="relative border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar.</p>
        <p>Descanse - Cauca, Colombia</p>
        <span className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-brand-600 via-accent-400 to-blue-400" />
      </footer>
    </div>
  )
}
