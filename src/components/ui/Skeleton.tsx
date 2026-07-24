import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-slate-200',
        'before:absolute before:inset-0',
        'before:bg-linear-to-r before:from-slate-200 before:via-slate-100 before:to-slate-200',
        'before:bg-size-[200%_100%] before:animate-[shimmer_1.5s_ease-in-out_infinite]',
        className,
      )}
      aria-hidden="true"
    />
  )
}
