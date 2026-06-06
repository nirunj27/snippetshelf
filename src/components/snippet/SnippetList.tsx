import { Code2, SearchX } from 'lucide-react'
import type { Snippet, ViewMode } from '../../types/snippet'
import type { Theme } from '../../hooks/useTheme'
import { SnippetCard } from './SnippetCard'
import { Button } from '../ui/Button'
import { cn } from '../../design-system/cn'

type SnippetListProps = {
  snippets: Snippet[]
  viewMode: ViewMode
  theme: Theme
  isSearchStale?: boolean
  hasActiveFilters?: boolean
  onCopy: (id: string) => void
  onToggleFavorite: (id: string) => void
  onDuplicate: (id: string) => void
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onOpen: (snippet: Snippet) => void
  onShare: () => void
  onTagClick: (tag: string) => void
  onClearFilters?: () => void
}

export function SnippetList({
  snippets,
  viewMode,
  theme,
  isSearchStale = false,
  hasActiveFilters = false,
  onCopy,
  onToggleFavorite,
  onDuplicate,
  onEdit,
  onDelete,
  onOpen,
  onShare,
  onTagClick,
  onClearFilters,
}: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-bg-surface px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-overlay text-text-tertiary">
          {hasActiveFilters ? <SearchX size={22} /> : <Code2 size={22} />}
        </div>
        <h3 className="mt-4 text-sm font-semibold text-text-primary">
          {hasActiveFilters ? 'No matching snippets' : 'No snippets yet'}
        </h3>
        <p className="mt-1 max-w-xs text-sm text-text-tertiary">
          {hasActiveFilters
            ? 'Try adjusting your search or filters.'
            : 'Add your first code snippet using the form on the left.'}
        </p>
        {hasActiveFilters && onClearFilters && (
          <Button variant="secondary" size="sm" className="mt-4" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4 transition-opacity duration-200',
        viewMode === 'grid' && 'grid-cols-1 md:grid-cols-2',
        isSearchStale && 'opacity-60',
      )}
    >
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          viewMode={viewMode}
          theme={theme}
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpen={onOpen}
          onShare={onShare}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  )
}
