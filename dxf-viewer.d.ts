declare module 'dxf-viewer' {
  import * as THREE from 'three'

  interface DxfViewerOptions {
    clearColor?: THREE.Color
    autoResize?: boolean
    canvasWidth?: number
    canvasHeight?: number
    antialiasing?: boolean
    colorCorrection?: boolean
  }

  interface DxfLoadOptions {
    url: string
    fonts?: string[] | null
    progressCbk?: ((phase: string, size: number, totalSize: number) => void) | null
    workerFactory?: unknown
  }

  class DxfViewer {
    constructor(domContainer: HTMLElement, options?: DxfViewerOptions)
    Load(options: DxfLoadOptions): Promise<void>
    Destroy(): void
    GetLayers(visibleOnly?: boolean): { name: string; displayName: string }[]
    ShowLayer(name: string, visible: boolean): void
    Render(): void
    SetView(center: { x: number; y: number }, width: number): void
    GetRenderer(): THREE.WebGLRenderer
    GetCamera(): THREE.Camera
    GetScene(): THREE.Scene
  }
}
