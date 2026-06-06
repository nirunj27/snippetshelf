import { useRef } from 'react'
import { Download, Keyboard, Upload } from 'lucide-react'
import { Button } from '../ui/Button'

type HeaderActionsProps = {
  onExport: () => void
  onImport: (file: File) => void
  exportLabel?: string
  exportHint?: string
}

export function HeaderActions({
  onExport,
  onImport,
  exportLabel = 'Export',
  exportHint,
}: HeaderActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-surface px-2.5 py-1.5 text-[11px] text-text-tertiary">
        <Keyboard size={11} />
        <kbd className="rounded bg-bg-overlay px-1 py-0.5 font-mono text-text-secondary">/</kbd>
        <span>search</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Upload size={14} />}
        onClick={() => fileInputRef.current?.click()}
      >
        Import
      </Button>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Download size={14} />}
        onClick={onExport}
        title={exportHint}
      >
        {exportLabel}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImport(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
