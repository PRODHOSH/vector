import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-24" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-48" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton({ cols = 3, count = 6 }: { cols?: number; count?: number }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${cols}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
               <Skeleton className="h-3 w-16" />
               <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border mt-4">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-7 w-7 rounded-full border-2 border-background" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CRMSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-md border bg-card">
      <div className="border-b border-border p-4 grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 border-b border-border last:border-0 grid grid-cols-6 gap-4 items-center">
          <div className="space-y-1 col-span-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Employee Productivity Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex space-x-2 border-b border-border pb-px">
         <Skeleton className="h-10 w-32 rounded-t-lg rounded-b-none" />
         <Skeleton className="h-10 w-32 rounded-t-lg rounded-b-none" />
         <Skeleton className="h-10 w-32 rounded-t-lg rounded-b-none" />
       </div>
       <div className="rounded-lg border bg-card p-6 space-y-6">
         <div className="space-y-2">
           <Skeleton className="h-6 w-48" />
           <Skeleton className="h-4 w-96" />
         </div>
         <div className="space-y-4 max-w-xl">
           <div className="space-y-2">
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-10 w-full rounded-md" />
           </div>
           <div className="space-y-2">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-10 w-full rounded-md" />
           </div>
           <Skeleton className="h-10 w-24 mt-4" />
         </div>
       </div>
    </div>
  );
}

// Keep the old generic ones that are still useful
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-md border bg-card">
      <div className="border-b border-border p-4 grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 border-b border-border last:border-0 grid grid-cols-5 gap-4 items-center">
          <div className="space-y-1 col-span-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-4 w-24" />
          <div className="flex justify-end">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="flex gap-2 pt-2">
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="h-8 w-16 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TeamSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 flex flex-col items-center text-center space-y-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ cols = 3, count = 6 }: { cols?: number; count?: number }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-${cols}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-7 w-7 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
