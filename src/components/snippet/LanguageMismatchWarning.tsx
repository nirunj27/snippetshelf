import { AlertTriangle } from 'lucide-react'
import type { Language } from '../../types/snippet'
import { LANGUAGE_LABELS } from '../../utils/languages'
import { Button } from '../ui/Button'

type LanguageMismatchWarningProps = {
  selected: Language
  suggested: Language
  onSwitch: () => void
  onDismiss: () => void
}

export function LanguageMismatchWarning({
  selected,
  suggested,
  onSwitch,
  onDismiss,
}: LanguageMismatchWarningProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-favorite/30 bg-favorite-muted px-3 py-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-favorite" />
        <p className="text-sm text-text-primary">
          This looks like <strong>{LANGUAGE_LABELS[suggested]}</strong>, but{' '}
          <strong>{LANGUAGE_LABELS[selected]}</strong> is selected. Switch language?
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pl-6">
        <Button variant="secondary" size="sm" onClick={onSwitch}>
          Use {LANGUAGE_LABELS[suggested]}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Keep {LANGUAGE_LABELS[selected]}
        </Button>
      </div>
    </div>
  )
}
