import { useEffect, useState } from 'react'
import { DxfView } from './DxfView.tsx'
import { StlView } from './StlView.tsx'
import { StepView } from './StepView.tsx'

interface FileMeta {
  format: string
  name: string
}

const SUPPORTED = ['dxf', 'stl', 'step', 'stp']

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <div style={labelStyle}>{meta ? meta.name : 'pyseas-ui viewer'}</div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {error && <div style={{ ...messageStyle, color: '#e55' }}>Error: {error}</div>}
        {!error && !meta && <div style={messageStyle}>Loading…</div>}
        {meta && meta.format === 'dxf' && <DxfView />}
        {meta && meta.format === 'stl' && <StlView />}
        {meta && (meta.format === 'step' || meta.format === 'stp') && <StepView />}
        {meta && !SUPPORTED.includes(meta.format) && (
          <div style={messageStyle}>Unsupported format: .{meta.format}</div>
        )}
      </div>
    </div>
  )
}
