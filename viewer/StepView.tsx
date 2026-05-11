import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface OcctMesh {
  name: string
  color: [number, number, number] | null
  attributes: {
    position: { array: number[] }
    normal?: { array: number[] }
  }
  index: { array: number[] }
}

interface OcctResult {
  success: boolean
  error?: string
  meshes: OcctMesh[]
}

export function StepView() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('Tessellating STEP file…')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.001, 100000)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dir = new THREE.DirectionalLight(0xffffff, 1)
    dir.position.set(1, 2, 3)
    scene.add(dir)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const observer = new ResizeObserver(() => {
      if (!mount || mount.clientWidth === 0 || mount.clientHeight === 0) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    observer.observe(mount)

    const abortController = new AbortController()
    const loadedMeshes: THREE.Mesh[] = []

    fetch('/__pyseas/mesh', { signal: abortController.signal })
      .then((r) => r.json() as Promise<OcctResult>)
      .then((data) => {
        if (!data.success) {
          setStatus(`STEP parse failed${data.error ? `: ${data.error}` : ''}`)
          return
        }

        const box = new THREE.Box3()

        for (const mesh of data.meshes) {
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute('position',
            new THREE.BufferAttribute(new Float32Array(mesh.attributes.position.array), 3))
          geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(mesh.index.array), 1))
          if (mesh.attributes.normal) {
            geometry.setAttribute('normal',
              new THREE.BufferAttribute(new Float32Array(mesh.attributes.normal.array), 3))
          } else {
            geometry.computeVertexNormals()
          }

          const [r, g, b] = mesh.color ?? [0.4, 0.53, 0.67]
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(r, g, b),
            specular: new THREE.Color(0.1, 0.1, 0.1),
            shininess: 40,
          })
          const obj = new THREE.Mesh(geometry, material)
          loadedMeshes.push(obj)
          scene.add(obj)
          box.expandByObject(obj)
        }

        if (!box.isEmpty()) {
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3()).length()
          camera.position.copy(center).add(new THREE.Vector3(0, 0, size * 1.5))
          controls.target.copy(center)
          controls.update()
        }

        setStatus('')
      })
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === 'AbortError') return
        setStatus(`Error: ${String(e)}`)
      })

    return () => {
      abortController.abort()
      cancelAnimationFrame(frameId)
      observer.disconnect()
      for (const mesh of loadedMeshes) {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      }
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {status && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ccc', fontFamily: 'monospace', fontSize: '0.85rem',
          background: 'rgba(0,0,0,0.7)', padding: '0.5rem 1rem',
          borderRadius: '4px', pointerEvents: 'none',
        }}>
          {status}
        </div>
      )}
    </div>
  )
}
