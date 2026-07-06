import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, type = 'text', className, id, name, ...props }, ref) => {
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const esPassword = type === 'password'
    const inputId = id ?? name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <span className="pointer-events-none absolute left-3 text-slate-400">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={esPassword ? (mostrarPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20',
              icon ? 'pl-10' : 'pl-3',
              esPassword ? 'pr-10' : 'pr-3',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
          {esPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setMostrarPassword((v) => !v)}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
