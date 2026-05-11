import { DxfViewer } from 'dxf-viewer'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function DxfView() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewer = new DxfViewer(container, {
      clearColor: new THREE.Color(0x1a1a1a),
      autoResize: true,
    })

    viewer
      .Load({
        url: '/__pyseas/file',
        progressCbk: () => {},
      })
      .catch((e: unknown) => {
        console.error('DXF load error:', e)
      })

    return () => {
      viewer.Destroy()
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
