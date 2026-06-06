import { useCallback, useRef, useState } from 'react'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastMessage = {
  id: string
  text: string
  type: 'success' | 'info' | 'error'
  action?: ToastAction
}

export function useToast(defaultDurationMs = 2800) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (
      text: string,
      type: ToastMessage['type'] = 'success',
      options?: { action?: ToastAction; durationMs?: number },
    ) => {
      const id = crypto.randomUUID()
      const durationMs = options?.durationMs ?? defaultDurationMs

      setToasts((prev) => [
        ...prev,
        { id, text, type, action: options?.action },
      ])

      const timer = setTimeout(() => dismiss(id), durationMs)
      timersRef.current.set(id, timer)
    },
    [defaultDurationMs, dismiss],
  )

  return { toasts, show, dismiss }
}
