import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../design-system/cn'
import { IconButton } from './IconButton'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative w-full max-w-md rounded-xl border border-border-default bg-bg-surface shadow-lg animate-toast-in',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-5 py-4">
          <div>
            <h2 id="modal-title" className="text-sm font-semibold text-text-primary">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-text-tertiary">{description}</p>
            )}
          </div>
          <IconButton label="Close" size="sm" onClick={onClose}>
            <X size={14} />
          </IconButton>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
