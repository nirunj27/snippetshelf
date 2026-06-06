import { Filter, Star, X } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../design-system/cn'

type TagFilterProps = {
  allTags: string[]
  selectedTags: string[]
  favoritesOnly: boolean
  onToggleTag: (tag: string) => void
  onToggleFavorites: (value: boolean) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export function TagFilter({
  allTags,
  selectedTags,
  favoritesOnly,
  onToggleTag,
  onToggleFavorites,
  onClear,
  hasActiveFilters,
}: TagFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <Filter size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} leftIcon={<X size={14} />}>
            Clear
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onToggleFavorites(!favoritesOnly)}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-150',
          favoritesOnly
            ? 'border-favorite/40 bg-favorite-muted text-favorite'
            : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary',
        )}
      >
        <Star size={14} className={favoritesOnly ? 'fill-favorite' : undefined} />
        Favorites only
      </button>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const selected = selectedTags.includes(tag)
            return (
              <Badge
                key={tag}
                variant={selected ? 'accent' : 'default'}
                interactive
                onClick={() => onToggleTag(tag)}
              >
                #{tag}
              </Badge>
            )
          })}
        </div>
      )}

      {allTags.length === 0 && (
        <p className="text-xs text-text-tertiary">Tags appear as you add snippets.</p>
      )}
    </div>
  )
}
