import { useMemo } from 'react'
import { Clock, Copy, Pencil, Star, Zap } from 'lucide-react'
import type { Snippet } from '../../types/snippet'
import { LANGUAGE_LABELS } from '../../utils/languages'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { IconButton } from '../ui/IconButton'
import { cn } from '../../design-system/cn'

type QuickAccessPanelProps = {
  snippets: Snippet[]
  onCopy: (id: string) => void
  onEdit: (snippet: Snippet) => void
  onShowFavorites: () => void
}

const MAX_ITEMS = 5

export function QuickAccessPanel({
  snippets,
  onCopy,
  onEdit,
  onShowFavorites,
}: QuickAccessPanelProps) {
  const favorites = useMemo(
    () =>
      [...snippets]
        .filter((s) => s.favorite)
        .sort((a, b) => b.copyCount - a.copyCount)
        .slice(0, MAX_ITEMS),
    [snippets],
  )

  const recent = useMemo(
    () =>
      [...snippets]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, MAX_ITEMS),
    [snippets],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-accent" />
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Quick access</h2>
            <p className="text-xs text-text-tertiary">Copy or edit in one click</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-5">
        <QuickSection
          title="Favorites"
          icon={<Star size={12} className="text-favorite" />}
          emptyText="Star snippets to pin them here."
          actionLabel={favorites.length > 0 ? 'View all' : undefined}
          onAction={onShowFavorites}
        >
          {favorites.map((snippet) => (
            <QuickItem
              key={snippet.id}
              snippet={snippet}
              onCopy={onCopy}
              onEdit={onEdit}
            />
          ))}
        </QuickSection>

        <QuickSection
          title="Recently updated"
          icon={<Clock size={12} className="text-secondary" />}
          emptyText="Edited snippets appear here."
        >
          {recent.map((snippet) => (
            <QuickItem
              key={`recent-${snippet.id}`}
              snippet={snippet}
              onCopy={onCopy}
              onEdit={onEdit}
            />
          ))}
        </QuickSection>
      </CardBody>
    </Card>
  )
}

function QuickSection({
  title,
  icon,
  emptyText,
  actionLabel,
  onAction,
  children,
}: {
  title: string
  icon: React.ReactNode
  emptyText: string
  actionLabel?: string
  onAction?: () => void
  children: React.ReactNode
}) {
  const items = Array.isArray(children) ? children : [children]
  const hasItems = items.some(Boolean) && items.filter(Boolean).length > 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {icon}
          {title}
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-[11px] font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {hasItems ? (
        <div className="space-y-1">{children}</div>
      ) : (
        <p className="rounded-lg border border-dashed border-border-subtle bg-bg-elevated px-3 py-2.5 text-xs text-text-tertiary">
          {emptyText}
        </p>
      )}
    </div>
  )
}

function QuickItem({
  snippet,
  onCopy,
  onEdit,
}: {
  snippet: Snippet
  onCopy: (id: string) => void
  onEdit: (snippet: Snippet) => void
}) {
  const { copy, copied } = useCopyToClipboard()

  const handleCopy = async () => {
    const ok = await copy(snippet.code)
    if (ok) onCopy(snippet.id)
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-elevated px-2.5 py-2',
        'transition-colors hover:border-border-default hover:bg-bg-hover',
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-text-primary">
          {snippet.title}
        </p>
        <p className="text-[10px] text-text-tertiary">
          {LANGUAGE_LABELS[snippet.language]}
          {snippet.copyCount > 0 && (
            <span className="ml-1.5 tabular-nums">· {snippet.copyCount} copies</span>
          )}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-80 group-hover:opacity-100">
        <IconButton
          label={copied ? 'Copied' : 'Quick copy'}
          size="sm"
          active={copied}
          onClick={handleCopy}
        >
          <Copy size={13} />
        </IconButton>
        <IconButton label="Edit" size="sm" onClick={() => onEdit(snippet)}>
          <Pencil size={13} />
        </IconButton>
      </div>
    </div>
  )
}
