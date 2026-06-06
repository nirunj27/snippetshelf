import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../design-system/cn'
import { IconButton } from '../ui/IconButton'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  isStale?: boolean
  placeholder?: string
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar(
    {
      value,
      onChange,
      isStale = false,
      placeholder = 'Search snippets, tags, languages...',
    },
    ref,
  ) {
    return (
      <div className="relative">
        <Search
          size={18}
          className={cn(
            'pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors',
            isStale ? 'text-accent animate-pulse' : 'text-text-tertiary',
          )}
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-11 w-full rounded-xl border bg-bg-elevated pl-11 pr-24 text-sm text-text-primary',
            'placeholder:text-text-tertiary transition-all duration-200',
            'border-border-default hover:border-border-strong',
            'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20',
            isStale && 'border-accent/40',
          )}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <kbd className="hidden sm:inline rounded border border-border-subtle bg-bg-overlay px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
            /
          </kbd>
          {value && (
            <IconButton label="Clear search" size="sm" onClick={() => onChange('')}>
              <X size={14} />
            </IconButton>
          )}
        </div>
      </div>
    )
  },
)
