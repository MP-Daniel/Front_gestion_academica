import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, variant = 'primary', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70',
          variant === 'primary' &&
            'bg-brand-700 text-white hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700',
          variant === 'secondary' &&
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
