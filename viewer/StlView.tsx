import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function StlView() {
  const mountRef = useRef<HTMLDivElement>(null)

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

    const loader = new STLLoader()
    loader.load('/__pyseas/file', (geometry) => {
      geometry.computeBoundingSphere()
      const sphere = geometry.boundingSphere
      if (sphere) {
        camera.position.copy(sphere.center).add(new THREE.Vector3(0, 0, sphere.radius * 3))
        controls.target.copy(sphere.center)
        controls.update()
      }
      scene.add(new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: 0x6688aa, specular: 0x222222, shininess: 40 })
      ))
    })

    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const observer = new ResizeObserver(() => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    observer.observe(mount)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
