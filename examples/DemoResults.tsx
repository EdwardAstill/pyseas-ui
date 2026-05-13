import { Result, StatusBadge, LogView, Toolbar } from '../src/index'

export type DemoResultsView = 'summary' | 'log'

interface DemoResultsProps {
  view: DemoResultsView
  logLines: string[]
}

export function DemoResults({ view, logLines }: DemoResultsProps) {
  if (view === 'log') {
    return <LogView lines={logLines} wrapLines={false} style={{ height: '100%', border: 0, background: 'transparent' }} />
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
      <div style={{ padding: 'var(--ps-space-sm) var(--ps-space-md)' }}>
        <Toolbar>
          <StatusBadge variant="ok" label="PASS" />
          <StatusBadge variant="warn" label="1 WARN" />
          <StatusBadge variant="err" label="1 FAIL" />
        </Toolbar>
      </div>
      <div style={{ padding: '0 var(--ps-space-md)' }}>
        <Result label="Utilisation" value={0.71} status="ok" ratio="0.71 / 1.00" />
        <Result label="Capacity" value={352.4} unit="kN" status="ok" ratio="0.63 / 1.00" />
        <Result
          label="Bearing stress" value={0.94} status="warn"
          ratio="0.94 / 1.00" note="Approaching limit"
        />
        <Result label="Shear check" value="FAIL" status="err" ratio="1.04 / 1.00" />
      </div>
    </div>
  )
}
