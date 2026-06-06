import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../design-system/cn'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  size?: 'sm' | 'md'
  active?: boolean
  children: ReactNode
}

export function IconButton({
  label,
  size = 'md',
  active = false,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-150',
        'text-text-secondary hover:text-text-primary hover:bg-bg-hover',
        'disabled:opacity-40 disabled:pointer-events-none',
        active && 'text-accent bg-accent-muted',
        size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
