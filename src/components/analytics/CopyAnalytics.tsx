import { BarChart3, Copy, Star, TrendingUp } from 'lucide-react'
import type { Snippet } from '../../types/snippet'
import { LANGUAGE_LABELS } from '../../utils/languages'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { cn } from '../../design-system/cn'

type CopyAnalyticsProps = {
  snippets: Snippet[]
}

export function CopyAnalytics({ snippets }: CopyAnalyticsProps) {
  const totalCopies = snippets.reduce((sum, s) => sum + s.copyCount, 0)
  const favoriteCount = snippets.filter((s) => s.favorite).length
  const topSnippets = [...snippets]
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, 5)
    .filter((s) => s.copyCount > 0)

  const maxCopies = topSnippets[0]?.copyCount ?? 1

  const languageStats = snippets.reduce<Record<string, number>>((acc, s) => {
    acc[s.language] = (acc[s.language] ?? 0) + 1
    return acc
  }, {})

  const topLanguage = Object.entries(languageStats).sort((a, b) => b[1] - a[1])[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-text-primary">Copy analytics</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Copy size={14} />}
            label="Total copies"
            value={totalCopies}
            variant="accent"
          />
          <StatCard
            icon={<Star size={14} />}
            label="Favorites"
            value={favoriteCount}
            variant="favorite"
          />
        </div>

        {topLanguage && (
          <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <TrendingUp size={12} />
              Most used language
            </div>
            <p className="mt-1 text-sm font-medium text-text-primary">
              {LANGUAGE_LABELS[topLanguage[0] as keyof typeof LANGUAGE_LABELS]}
              <span className="ml-1.5 text-text-tertiary font-normal">
                ({topLanguage[1]} snippets)
              </span>
            </p>
          </div>
        )}

        {topSnippets.length > 0 ? (
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
              Top copied
            </p>
            {topSnippets.map((snippet, i) => (
              <div key={snippet.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-text-secondary">
                    <span className="text-text-tertiary mr-1.5 tabular-nums">{i + 1}.</span>
                    {snippet.title}
                  </span>
                  <span className="shrink-0 text-xs font-medium text-accent tabular-nums">
                    {snippet.copyCount}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/70 transition-all duration-500"
                    style={{ width: `${(snippet.copyCount / maxCopies) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-tertiary text-center py-2">
            Copy snippets to see analytics here.
          </p>
        )}
      </CardBody>
    </Card>
  )
}

function StatCard({
  icon,
  label,
  value,
  variant = 'default',
}: {
  icon: React.ReactNode
  label: string
  value: number
  variant?: 'default' | 'accent' | 'favorite'
}) {
  const boxStyles = {
    default: 'border-border-subtle bg-bg-elevated',
    accent: 'border-accent-border bg-accent-muted',
    favorite: 'border-favorite/30 bg-favorite-muted',
  }

  const valueStyles = {
    default: 'text-text-primary',
    accent: 'text-accent',
    favorite: 'text-favorite',
  }

  return (
    <div className={cn('rounded-lg border px-3 py-2.5', boxStyles[variant])}>
      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
        {icon}
        {label}
      </div>
      <p className={cn('mt-1 text-xl font-bold tabular-nums', valueStyles[variant])}>
        {value}
      </p>
    </div>
  )
}
