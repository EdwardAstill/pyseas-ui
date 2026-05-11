import { useEffect, useState } from 'react'
import { DxfView } from './DxfView.tsx'
import { StlView } from './StlView.tsx'
import { StepView } from './StepView.tsx'

interface FileMeta {
  format: string
  name: string
}

const labelStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  background: '#111',
  color: '#aaa',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  borderBottom: '1px solid #2a2a2a',
  flexShrink: 0,
}

const messageStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#888',
  fontFamily: 'monospace',
  fontSize: '0.9rem',
}

export function ViewerApp() {
  const [meta, setMeta] = useState<FileMeta | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/__pyseas/meta')
      .then((r) => r.json() as Promise<FileMeta>)
      .then(setMeta)
      .catch((e: unknown) => setError(String(e)))
  }, [])

  function renderContent() {
    if (error) return <div style={{ ...messageStyle, color: '#e55' }}>Error: {error}</div>
    if (!meta) return <div style={messageStyle}>Loading…</div>
    if (meta.format === 'dxf') return <DxfView />
    if (meta.format === 'stl') return <StlView />
    if (meta.format === 'step' || meta.format === 'stp') return <StepView />
    return <div style={messageStyle}>Unsupported format: .{meta.format}</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <div style={labelStyle}>{meta ? meta.name : 'pyseas-ui viewer'}</div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {renderContent()}
      </div>
    </div>
  )
}
