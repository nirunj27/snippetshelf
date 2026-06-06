import { createContext, useContext, type ReactNode } from 'react'
import type { Snippet, ViewMode } from '../../../types/snippet'
import type { Theme } from '../../../hooks/useTheme'

export type SnippetCardContextValue = {
  snippet: Snippet
  viewMode: ViewMode
  theme: Theme
  onCopy: () => void
  onToggleFavorite: () => void
  onDuplicate: () => void
  onEdit: () => void
  onDelete: () => void
  onOpen: () => void
  onShare: () => void
  onTagClick: (tag: string) => void
  copied: boolean
  linkCopied: boolean
}

const SnippetCardContext = createContext<SnippetCardContextValue | null>(null)

export function SnippetCardProvider({
  value,
  children,
}: {
  value: SnippetCardContextValue
  children: ReactNode
}) {
  return (
    <SnippetCardContext.Provider value={value}>
      {children}
    </SnippetCardContext.Provider>
  )
}

export function useSnippetCard() {
  const ctx = useContext(SnippetCardContext)
  if (!ctx) {
    throw new Error('SnippetCard compound components must be used within SnippetCard')
  }
  return ctx
}
