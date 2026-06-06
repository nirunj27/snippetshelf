import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../design-system/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  glow?: boolean
}

export function Card({ children, glow = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-bg-surface',
        glow && 'shadow-glow',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-3 px-4 py-3', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-4 pb-4', className)} {...props}>
      {children}
    </div>
  )
}
