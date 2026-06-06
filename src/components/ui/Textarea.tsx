import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../design-system/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

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
      <textarea
        id={inputId}
        className={cn(
          'min-h-[140px] w-full resize-y rounded-lg border border-border-default bg-bg-elevated px-3 py-2.5',
          'font-mono text-sm text-text-primary leading-relaxed',
          'placeholder:text-text-tertiary transition-colors duration-150',
          'hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
          className,
        )}
        {...props}
      />
    </div>
  )
}
