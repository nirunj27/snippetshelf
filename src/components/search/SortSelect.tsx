import { ArrowDownAZ, ArrowUpDown, Clock, Copy, History } from 'lucide-react'
import type { SortOption } from '../../types/snippet'
import { cn } from '../../design-system/cn'

const SORT_OPTIONS: { value: SortOption; label: string; icon: typeof Clock }[] = [
  { value: 'recent', label: 'Recent', icon: Clock },
  { value: 'oldest', label: 'Oldest', icon: History },
  { value: 'most-copied', label: 'Most copied', icon: Copy },
  { value: 'alphabetical', label: 'A → Z', icon: ArrowDownAZ },
]

type SortSelectProps = {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-text-secondary">
        <ArrowUpDown size={14} />
        <span className="text-xs font-medium uppercase tracking-wide">Sort by</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SORT_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-150',
                active
                  ? 'border-accent-border bg-accent-muted text-accent'
                  : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary',
              )}
            >
              <Icon size={12} />
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
