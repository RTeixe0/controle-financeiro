import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border bg-card p-6 shadow', className)} {...props} />
}
