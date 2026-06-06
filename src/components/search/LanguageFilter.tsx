import { Code2 } from 'lucide-react'
import type { Language } from '../../types/snippet'
import { LANGUAGES } from '../../utils/languages'
import { cn } from '../../design-system/cn'

type LanguageFilterProps = {
  value: Language | 'all'
  onChange: (value: Language | 'all') => void
  snippetCounts: Record<string, number>
}

export function LanguageFilter({ value, onChange, snippetCounts }: LanguageFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-text-secondary">
        <Code2 size={14} />
        <span className="text-xs font-medium uppercase tracking-wide">Language</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          label="All"
          count={Object.values(snippetCounts).reduce((a, b) => a + b, 0)}
          active={value === 'all'}
          onClick={() => onChange('all')}
        />
        {LANGUAGES.map((lang) => {
          const count = snippetCounts[lang.value] ?? 0
          if (count === 0 && value !== lang.value) return null
          return (
            <FilterChip
              key={lang.value}
              label={lang.label}
              count={count}
              active={value === lang.value}
              onClick={() => onChange(lang.value)}
            />
          )
        })}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-150',
        active
          ? 'border-secondary/40 bg-secondary-muted text-secondary'
          : 'border-border-default bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded px-1 py-0.5 text-[10px] tabular-nums',
          active ? 'bg-secondary/20' : 'bg-bg-overlay text-text-tertiary',
        )}
      >
        {count}
      </span>
    </button>
  )
}
