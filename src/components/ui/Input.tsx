import type { InputHTMLAttributes } from 'react'
import { cn } from '../../design-system/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
}

export function Input({ label, hint, className, id, 'aria-invalid': ariaInvalid, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const hasError = ariaInvalid === true || ariaInvalid === 'true'

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-text-secondary uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={ariaInvalid}
        className={cn(
          'h-10 w-full rounded-lg border bg-bg-elevated px-3 text-sm text-text-primary',
          'placeholder:text-text-tertiary transition-colors duration-150',
          'hover:border-border-strong focus:outline-none focus:ring-2',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-border-default focus:border-accent focus:ring-accent/20',
          className,
        )}
        {...props}
      />
      {hint && (
        <p className={cn('text-xs', hasError ? 'text-danger' : 'text-text-tertiary')}>
          {hint}
        </p>
      )}
    </div>
  )
}
