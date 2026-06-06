import { useEffect } from 'react'

type ShortcutOptions = {
  meta?: boolean
  ctrl?: boolean
  shift?: boolean
  ignoreInputs?: boolean
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  ) {
    return true
  }

  return Boolean(target.closest('.cm-editor'))
}

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: ShortcutOptions = { ignoreInputs: true },
) {
  const { meta, ctrl, shift, ignoreInputs = true } = options

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (ignoreInputs && isEditableTarget(e.target)) return
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      if (meta !== undefined && e.metaKey !== meta) return
      if (ctrl !== undefined && e.ctrlKey !== ctrl) return
      if (shift !== undefined && e.shiftKey !== shift) return

      e.preventDefault()
      handler()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, handler, meta, ctrl, shift, ignoreInputs])
}
