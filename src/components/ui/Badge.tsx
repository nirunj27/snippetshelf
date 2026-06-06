import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../design-system/cn'

type BadgeVariant = 'default' | 'accent' | 'favorite' | 'language'

type BadgeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BadgeVariant
  interactive?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-overlay text-text-secondary border-border-default',
  accent: 'bg-accent-muted text-accent border-accent-border',
  favorite: 'bg-favorite-muted text-favorite border-favorite/30',
  language: 'bg-bg-hover text-text-secondary border-border-subtle font-mono',
}

export function Badge({
  variant = 'default',
  interactive = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const Component = interactive ? 'button' : 'span'

  return (
    <Component
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        interactive &&
          'cursor-pointer transition-colors hover:bg-bg-hover hover:text-text-primary',
        className,
      )}
      {...(interactive ? props : {})}
    >
      {children}
    </Component>
  )
}
