import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import type { ToastMessage } from '../../hooks/useToast'
import { cn } from '../../design-system/cn'
import { IconButton } from './IconButton'
import { Button } from './Button'

type ToastContainerProps = {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

const iconMap = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
}

const styleMap = {
  success: 'border-success/30 bg-success/10',
  info: 'border-secondary/30 bg-secondary-muted',
  error: 'border-danger/30 bg-danger-muted',
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 shadow-md animate-toast-in',
              'bg-bg-surface backdrop-blur-md min-w-[260px] max-w-sm',
              styleMap[toast.type],
            )}
          >
            <Icon size={16} className="shrink-0 text-text-secondary" />
            <span className="flex-1 text-sm font-medium text-text-primary">
              {toast.text}
            </span>
            {toast.action && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  toast.action?.onClick()
                  onDismiss(toast.id)
                }}
              >
                {toast.action.label}
              </Button>
            )}
            <IconButton
              label="Dismiss"
              size="sm"
              onClick={() => onDismiss(toast.id)}
              className="text-text-tertiary hover:text-text-primary"
            >
              <X size={12} />
            </IconButton>
          </div>
        )
      })}
    </div>
  )
}
