export function DemoDiagram() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--ps-space-md)',
        overflow: 'auto',
      }}
    >
      <svg
        width="200"
        height="160"
        viewBox="0 0 200 160"
        style={{ opacity: 0.7 }}
        aria-label="Geometry diagram"
      >
        <rect
          x="30" y="40" width="140" height="80"
          fill="none" stroke="var(--ps-text-muted)" strokeWidth="1.5"
        />
        <circle
          cx="100" cy="80" r="18"
          fill="none" stroke="var(--ps-text-muted)" strokeWidth="1.5"
        />
        <defs>
          <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
            <path d="M0,6 L3,0 L6,6" fill="var(--ps-accent)" />
          </marker>
        </defs>
        <line
          x1="100" y1="10" x2="100" y2="38"
          stroke="var(--ps-accent)" strokeWidth="1.5" markerEnd="url(#arrowUp)"
        />
        <line
          x1="30" y1="135" x2="170" y2="135"
          stroke="var(--ps-text-muted)" strokeWidth="1" strokeDasharray="3 3"
        />
        <text x="100" y="150" textAnchor="middle" fontSize="10"
          fill="var(--ps-text-muted)" fontFamily="var(--ps-font-mono)">
          300 mm
        </text>
        <text x="100" y="25" textAnchor="middle" fontSize="10"
          fill="var(--ps-accent)" fontFamily="var(--ps-font-mono)">
          F = 250 kN
        </text>
      </svg>
    </div>
  )
}
