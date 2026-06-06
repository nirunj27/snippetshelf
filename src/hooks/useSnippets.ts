import { useCallback, useEffect, useState } from 'react'
import type { Snippet, SnippetInput } from '../types/snippet'
import { loadSnippets, saveSnippets } from '../utils/storage'

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>(() => loadSnippets())

  useEffect(() => {
    saveSnippets(snippets)
  }, [snippets])

  const addSnippet = useCallback((input: SnippetInput) => {
    const now = new Date().toISOString()
    const snippet: Snippet = {
      ...input,
      id: crypto.randomUUID(),
      favorite: false,
      copyCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    setSnippets((prev) => [snippet, ...prev])
    return snippet.id
  }, [])

  const updateSnippet = useCallback((id: string, input: SnippetInput) => {
    setSnippets((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, ...input, updatedAt: new Date().toISOString() }
          : s,
      ),
    )
  }, [])

  const deleteSnippet = useCallback((id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const restoreSnippet = useCallback((snippet: Snippet, index: number) => {
    setSnippets((prev) => {
      if (prev.some((s) => s.id === snippet.id)) return prev
      const next = [...prev]
      const safeIndex = Math.min(Math.max(index, 0), next.length)
      next.splice(safeIndex, 0, snippet)
      return next
    })
  }, [])

  const duplicateSnippet = useCallback((id: string) => {
    const now = new Date().toISOString()
    setSnippets((prev) => {
      const source = prev.find((s) => s.id === id)
      if (!source) return prev

      const duplicate: Snippet = {
        ...source,
        id: crypto.randomUUID(),
        title: `${source.title} (copy)`,
        copyCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      return [duplicate, ...prev]
    })
  }, [])

  const importSnippets = useCallback((incoming: Snippet[], mode: 'merge' | 'replace') => {
    setSnippets((prev) => (mode === 'replace' ? incoming : [...incoming, ...prev]))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setSnippets((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, favorite: !s.favorite, updatedAt: new Date().toISOString() }
          : s,
      ),
    )
  }, [])

  const incrementCopyCount = useCallback((id: string) => {
    setSnippets((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, copyCount: s.copyCount + 1 } : s,
      ),
    )
  }, [])

  return {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    restoreSnippet,
    duplicateSnippet,
    importSnippets,
    toggleFavorite,
    incrementCopyCount,
  }
}
