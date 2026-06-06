import { useEffect } from 'react'
import { parseSnippetIdFromHash } from '../utils/share'

export function useSnippetHash(onOpen: (id: string) => void) {
  useEffect(() => {
    const handleHash = () => {
      const id = parseSnippetIdFromHash()
      if (id) onOpen(id)
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [onOpen])
}
