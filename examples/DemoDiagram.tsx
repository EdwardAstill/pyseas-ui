import { DrawingViewer } from '../src/index'

const sampleDrawing = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" role="img" aria-label="Sample drawing">
  <rect x="28" y="46" width="176" height="72" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="116" cy="82" r="20" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M116 82 L116 24" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M36 132 L196 132" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="116" y="148" text-anchor="middle" font-size="10" font-family="monospace" fill="currentColor">300 mm</text>
</svg>`

export function DemoDiagram() {
  return (
    <DrawingViewer
      source={{ kind: 'svg', content: sampleDrawing }}
      metadata="sample svg"
      download={{ href: '#', label: 'DXF' }}
    />
  )
}
