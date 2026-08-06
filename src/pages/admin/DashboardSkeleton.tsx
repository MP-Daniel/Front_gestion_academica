import { Skeleton } from '@/components/ui/Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,0.85fr)_minmax(0,1.25fr)] xl:gap-4 xl:items-start">
      {/* Main stat card skeleton */}
      <div className="flex flex-col gap-6">
        <div className="relative w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]">
          <div className="absolute inset-y-0 left-0 w-1 bg-slate-200" />
          <div className="relative flex items-start justify-between gap-6">
            <div className="relative z-10 min-w-0 flex-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-3 h-10 w-20" />
              <div className="mt-4 border-t border-slate-100 pt-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-7 w-16" />
              </div>
            </div>
            <Skeleton className="h-24 w-24 shrink-0 rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Secondary stat cards skeleton */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border-l-4 border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="relative z-10 flex flex-col justify-start pr-10">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-2 h-6 w-14" />
            </div>
            <Skeleton className="absolute right-3 top-1/2 h-14 w-14 -translate-y-1/2 -rotate-12 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Events skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-1 h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
