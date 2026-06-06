import { LayoutGrid, List } from 'lucide-react'
import type { ViewMode } from '../../types/snippet'
import { cn } from '../../design-system/cn'

type ViewToggleProps = {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border-default bg-bg-elevated p-0.5">
      {(
        [
          { mode: 'list' as const, icon: List, label: 'List view' },
          { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid view' },
        ] as const
      ).map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          title={label}
          onClick={() => onChange(mode)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150',
            value === mode
              ? 'bg-accent-muted text-accent shadow-sm'
              : 'text-text-tertiary hover:text-text-primary hover:bg-bg-hover',
          )}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}
