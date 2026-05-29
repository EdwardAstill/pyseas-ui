import { PARTS } from './demoData'

interface DemoRailProps {
  selected: string
  onSelect: (id: string) => void
}

export function DemoRail({ selected, onSelect }: DemoRailProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ps-space-xs)',
        padding: 'var(--ps-space-sm)',
      }}
    >
      <div
        style={{
          fontSize: 'var(--ps-text-xs)',
          color: 'var(--ps-text-muted)',
          padding: '0 var(--ps-space-xs)',
          marginBottom: 'var(--ps-space-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Parts
      </div>
      {PARTS.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          type="button"
          style={{
            background: selected === p.id ? 'var(--ps-accent)' : 'transparent',
            color: selected === p.id ? '#fff' : 'var(--ps-text)',
            border: '1px solid',
            borderColor: selected === p.id ? 'var(--ps-accent)' : 'var(--ps-border)',
            padding: 'var(--ps-space-xs) var(--ps-space-sm)',
            fontSize: 'var(--ps-text-sm)',
            fontFamily: 'var(--ps-font-mono)',
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: 'var(--ps-radius-xs)',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
