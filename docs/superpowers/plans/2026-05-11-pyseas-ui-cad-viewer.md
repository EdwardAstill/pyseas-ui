# ui CAD Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `ui view <file>` CLI command that opens DXF, STL, and STEP files in a browser viewer.

**Architecture:** A new `view` subcommand in `bin/ui.mjs` spawns a Vite dev server (using a separate `vite.viewer.config.ts`) with a custom plugin that serves the CAD file and — for STEP — tessellates it server-side with `occt-import-js`. The browser renders DXF with `dxf-viewer`, STL/STEP geometry with Three.js.

**Tech Stack:** Bun, Vite 6, React 19, TypeScript 5.8, Three.js, dxf-viewer (vagran), occt-import-js (WASM OpenCASCADE for STEP tessellation).

---

## File Map

| File | Action |
|---|---|
| `package.json` | Modify — add `three`, `@types/three`, `dxf-viewer`, `occt-import-js` to devDependencies |
| `tsconfig.app.json` | Modify — add `"viewer"` to `include` |
| `bin/ui.mjs` | Modify — add `view` command: `parseViewArgs`, `runView`, updated helpText, updated dispatch |
| `vite.viewer.config.ts` | Create — Vite config for viewer mode + file-serving plugin |
| `viewer/index.html` | Create — HTML entry for viewer app |
| `viewer/main.tsx` | Create — React root |
| `viewer/ViewerApp.tsx` | Create — fetches `/__pyseas/meta`, renders DxfView / StlView / StepView |
| `viewer/DxfView.tsx` | Create — DXF renderer using `dxf-viewer` |
| `viewer/StlView.tsx` | Create — STL renderer using Three.js STLLoader |
| `viewer/StepView.tsx` | Create — STEP renderer: fetches tessellated mesh from `/__pyseas/mesh`, renders with Three.js |
| `tests/fixtures/test.step` | Create — 2-line STEP fixture for CLI tests |
| `tests/fixtures/test.dxf` | Create — 2-line DXF fixture for CLI tests |
| `tests/fixtures/test.stl` | Create — minimal ASCII STL fixture for CLI tests |
| `tests/viewer-cli.test.ts` | Create — Bun tests for `view` arg parsing |

---

### Task 1: Install dependencies and update tsconfig

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.app.json`

- [ ] **Step 1: Install new packages**

Run from `/home/eastill/projects/ui`:
```bash
bun add -D three @types/three dxf-viewer occt-import-js
```
Expected: 4 packages added to devDependencies in `package.json`

- [ ] **Step 2: Update tsconfig.app.json to include viewer directory**

In `tsconfig.app.json`, change:
```json
"include": ["src", "examples"]
```
To:
```json
"include": ["src", "examples", "viewer"]
```

- [ ] **Step 3: Verify types resolve**

Run:
```bash
bun run typecheck
```
Expected: 0 errors (no viewer files exist yet, so nothing to check — this is a baseline)

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock tsconfig.app.json
git commit -m "chore: add three, dxf-viewer, occt-import-js dependencies"
```

---

### Task 2: CLI view command with test fixtures (TDD)

**Files:**
- Create: `tests/fixtures/test.step`
- Create: `tests/fixtures/test.dxf`
- Create: `tests/fixtures/test.stl`
- Create: `tests/viewer-cli.test.ts`
- Modify: `bin/ui.mjs`

- [ ] **Step 1: Create test fixtures**

Create `tests/fixtures/test.step`:
```
ISO-10303-21;
END-ISO-10303-21;
```

Create `tests/fixtures/test.dxf`:
```
0
EOF
```

Create `tests/fixtures/test.stl`:
```
solid test
endsolid test
```

- [ ] **Step 2: Write failing tests**

Create `tests/viewer-cli.test.ts`:

```typescript
import { describe, test, expect } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const CLI = resolve(import.meta.dir, '../bin/ui.mjs')
const FIXTURES = resolve(import.meta.dir, 'fixtures')

function runCli(args: string[], env: Record<string, string> = {}) {
  return spawnSync('bun', [CLI, ...args], {
    env: { ...process.env, ...env },
    encoding: 'utf8',
  })
}

describe('view command — argument errors', () => {
  test('exits 2 with no file argument', () => {
    const r = runCli(['view'])
    expect(r.status).toBe(2)
    expect(r.stderr).toContain('requires a file path')
  })

  test('exits 2 with a flag instead of a file', () => {
    const r = runCli(['view', '--port'])
    expect(r.status).toBe(2)
    expect(r.stderr).toContain('expected a file path')
  })

  test('exits 2 with more than one path', () => {
    const r = runCli(['view', 'a.step', 'b.step'])
    expect(r.status).toBe(2)
    expect(r.stderr).toContain('one file path only')
  })

  test('exits 2 for unsupported extension', () => {
    const r = runCli(['view', 'model.mp4'])
    expect(r.status).toBe(2)
    expect(r.stderr).toContain('unsupported format')
  })
})

describe('view command — accepted formats', () => {
  test('accepts .step and prints resolved path', () => {
    const file = resolve(FIXTURES, 'test.step')
    const r = runCli(['view', file], { UI_VIEW_PRINT_ARGS: '1' })
    expect(r.status).toBe(0)
    expect(r.stdout.trim()).toBe(file)
  })

  test('accepts .dxf and prints resolved path', () => {
    const file = resolve(FIXTURES, 'test.dxf')
    const r = runCli(['view', file], { UI_VIEW_PRINT_ARGS: '1' })
    expect(r.status).toBe(0)
    expect(r.stdout.trim()).toBe(file)
  })

  test('accepts .stl and prints resolved path', () => {
    const file = resolve(FIXTURES, 'test.stl')
    const r = runCli(['view', file], { UI_VIEW_PRINT_ARGS: '1' })
    expect(r.status).toBe(0)
    expect(r.stdout.trim()).toBe(file)
  })

  test('accepts relative path and resolves to absolute', () => {
    const r = runCli(['view', 'tests/fixtures/test.step'], { UI_VIEW_PRINT_ARGS: '1' })
    expect(r.status).toBe(0)
    expect(r.stdout.trim()).toMatch(/^\//)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
bun test tests/viewer-cli.test.ts
```
Expected: FAIL — `view` command does not exist yet, all tests fail or error

- [ ] **Step 4: Implement view command in bin/ui.mjs**

Replace the entire file content with:

```javascript
#!/usr/bin/env bun
import { resolve } from 'node:path'

const packageRoot = resolve(import.meta.dir, '..')

const helpText = `ui - developer tools for ui

USAGE:
  ui demo [--port <port>] [--host <host>] [--open] [--strict-port]
  ui view <file>
  ui --help

COMMANDS:
  demo       Start the examples showcase with Vite
  view       Open a DXF, STL, or STEP file in the browser viewer

OPTIONS (demo):
  --port <port>     Dev-server port
  --host <host>     Dev-server host
  --open            Open the demo in the browser
  --strict-port     Fail if the requested port is unavailable
  -h, --help        Show help

EXAMPLES:
  ui demo
  ui demo --open
  ui view plate.dxf
  ui view model.step
  ui view part.stl
`

function usageError(message) {
  process.stderr.write(`${message}\nRun \`ui --help\` for usage.\n`)
  process.exit(2)
}

function readValue(args, index, flag) {
  const value = args[index + 1]
  if (value === undefined || value.startsWith('-')) usageError(`missing value for \`${flag}\``)
  return value
}

function parseDemoArgs(args) {
  const viteArgs = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '-h':
      case '--help':
        process.stdout.write(helpText)
        process.exit(0)
        break
      case '--port': {
        const value = readValue(args, i, arg)
        if (!/^\d+$/.test(value)) usageError('`--port` must be a number')
        viteArgs.push('--port', value)
        i++
        break
      }
      case '--host': {
        const value = readValue(args, i, arg)
        viteArgs.push('--host', value)
        i++
        break
      }
      case '--open':
        viteArgs.push('--open')
        break
      case '--strict-port':
        viteArgs.push('--strictPort')
        break
      default:
        usageError(`unknown option \`${arg}\``)
    }
  }

  return viteArgs
}

function parseViewArgs(args) {
  if (args.length === 0) usageError('`view` requires a file path')
  if (args.length > 1) usageError('`view` accepts one file path only')
  const filePath = args[0]
  if (!filePath || filePath.startsWith('-')) usageError('expected a file path, not a flag')
  const allowed = ['.dxf', '.stl', '.step', '.stp']
  const dot = filePath.lastIndexOf('.')
  const ext = dot === -1 ? '' : filePath.slice(dot).toLowerCase()
  if (!allowed.includes(ext)) {
    usageError(`unsupported format \`${ext}\`; supported: .dxf, .stl, .step`)
  }
  return resolve(filePath)
}

function resolveDemoCommand(viteArgs) {
  if (process.env.UI_DEMO_CHILD_JSON) {
    const parsed = JSON.parse(process.env.UI_DEMO_CHILD_JSON)
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
      usageError('invalid UI_DEMO_CHILD_JSON')
    }
    return parsed
  }

  return ['bun', 'run', 'vite', ...viteArgs]
}

function browserExecutable(browser) {
  return browser.trim().split(/\s+/)[0]
}

function childEnvForDemo(viteArgs) {
  const env = { ...process.env }

  if (viteArgs.includes('--open') && env.BROWSER) {
    const browser = browserExecutable(env.BROWSER)
    if (browser && !Bun.which(browser)) delete env.BROWSER
  }

  return env
}

async function pipeToStderr(stream) {
  if (!stream) return

  const writer = Bun.stderr.writer()
  for await (const chunk of stream) {
    writer.write(chunk)
  }
  writer.flush()
}

async function spawnAndWait(command, env) {
  let child
  try {
    child = Bun.spawn(command, {
      cwd: packageRoot,
      env,
      stdin: 'inherit',
      stdout: 'pipe',
      stderr: 'pipe',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`could not start process: ${message}\n`)
    process.exit(1)
  }

  let signalExitCode = null

  function forwardSignal(signal, code) {
    signalExitCode = code
    process.off('SIGINT', onSigint)
    process.off('SIGTERM', onSigterm)
    child.kill(signal)
  }

  function onSigint() { forwardSignal('SIGINT', 130) }
  function onSigterm() { forwardSignal('SIGTERM', 143) }

  process.on('SIGINT', onSigint)
  process.on('SIGTERM', onSigterm)

  const stdoutPipe = pipeToStderr(child.stdout)
  const stderrPipe = pipeToStderr(child.stderr)
  const code = await child.exited

  process.off('SIGINT', onSigint)
  process.off('SIGTERM', onSigterm)
  await Promise.all([stdoutPipe, stderrPipe])

  if (signalExitCode !== null) process.exit(signalExitCode)
  process.exit(code)
}

async function runDemo(rawArgs) {
  const viteArgs = parseDemoArgs(rawArgs)
  const demoCommand = resolveDemoCommand(viteArgs)

  if (process.env.UI_DEMO_PRINT_ARGS === '1') {
    process.stdout.write(`${JSON.stringify({ cwd: packageRoot, viteArgs })}\n`)
    return
  }

  if (!demoCommand[0]) usageError('missing demo command')

  await spawnAndWait(demoCommand, childEnvForDemo(viteArgs))
}

async function runView(rawArgs) {
  const absPath = parseViewArgs(rawArgs)

  if (process.env.UI_VIEW_PRINT_ARGS === '1') {
    process.stdout.write(`${absPath}\n`)
    return
  }

  const command = ['bun', 'run', 'vite', '--config', 'vite.viewer.config.ts', '--open']
  const env = { ...process.env, UI_VIEW_FILE: absPath }
  await spawnAndWait(command, env)
}

const [command, ...args] = process.argv.slice(2)

if (command === undefined || command === '-h' || command === '--help') {
  process.stdout.write(helpText)
  process.exit(0)
}

if (command === 'demo') {
  await runDemo(args)
} else if (command === 'view') {
  await runView(args)
} else {
  usageError(`unknown command \`${command}\``)
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
bun test tests/viewer-cli.test.ts
```
Expected: all 7 tests pass

- [ ] **Step 6: Run existing tests to verify no regression**

```bash
bun test
```
Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add bin/ui.mjs tests/viewer-cli.test.ts tests/fixtures/
git commit -m "feat(cli): add view command for DXF/STL/STEP files"
```

---

### Task 3: Vite viewer config + file-serving plugin

**Files:**
- Create: `vite.viewer.config.ts`

This file has no unit tests — the middleware is exercised manually when the viewer runs. Typecheck covers it.

- [ ] **Step 1: Create vite.viewer.config.ts**

```typescript
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

function serializeForJson(value: unknown): unknown {
  if (value instanceof Float32Array || value instanceof Uint32Array || value instanceof Int32Array) {
    return Array.from(value)
  }
  if (Array.isArray(value)) {
    return value.map(serializeForJson)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, serializeForJson(v)])
    )
  }
  return value
}

function cadFilePlugin(): Plugin {
  return {
    name: 'cad-file-server',
    configureServer(server) {
      server.middlewares.use('/__pyseas/meta', (_req, res) => {
        const filePath = process.env['UI_VIEW_FILE'] ?? ''
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'UI_VIEW_FILE not set' }))
          return
        }
        const name = filePath.split('/').pop() ?? filePath
        const dot = filePath.lastIndexOf('.')
        const format = dot === -1 ? '' : filePath.slice(dot + 1).toLowerCase()
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ format, name, path: filePath }))
      })

      server.middlewares.use('/__pyseas/file', (_req, res) => {
        const filePath = process.env['UI_VIEW_FILE'] ?? ''
        if (!filePath) {
          res.statusCode = 400
          res.end('UI_VIEW_FILE not set')
          return
        }
        const buf = readFileSync(filePath)
        const name = filePath.split('/').pop() ?? 'file'
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Disposition', `inline; filename="${name}"`)
        res.end(buf)
      })

      server.middlewares.use('/__pyseas/mesh', async (_req, res) => {
        const filePath = process.env['UI_VIEW_FILE'] ?? ''
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'UI_VIEW_FILE not set' }))
          return
        }
        try {
          const buf = readFileSync(filePath)
          const initOcct = (await import('occt-import-js')).default as () => Promise<{
            ReadStepFile: (buf: Buffer, params: null) => unknown
          }>
          const occt = await initOcct()
          const result = occt.ReadStepFile(buf, null)
          const serialized = serializeForJson(result)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(serialized))
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), cadFilePlugin()],
  root: resolve(__dirname, 'viewer'),
  optimizeDeps: {
    exclude: ['occt-import-js'],
  },
})
```

- [ ] **Step 2: Verify typecheck passes**

```bash
bun run typecheck
```
Expected: 0 errors (vite.viewer.config.ts is not in tsconfig include — Vite processes it via esbuild, so type errors here appear only at runtime or via a separate check)

- [ ] **Step 3: Commit**

```bash
git add vite.viewer.config.ts
git commit -m "feat(viewer): add Vite viewer config with CAD file-serving plugin"
```

---

### Task 4: Viewer HTML, React entry, and ViewerApp

**Files:**
- Create: `viewer/index.html`
- Create: `viewer/main.tsx`
- Create: `viewer/ViewerApp.tsx`

- [ ] **Step 1: Create viewer/index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ui viewer</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #1a1a1a; }
      #root { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create viewer/main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ViewerApp } from './ViewerApp'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('No #root element found')

createRoot(rootEl).render(
  <StrictMode>
    <ViewerApp />
  </StrictMode>
)
```

- [ ] **Step 3: Create viewer/ViewerApp.tsx**

```typescript
import { useEffect, useState } from 'react'
import { DxfView } from './DxfView'
import { StlView } from './StlView'
import { StepView } from './StepView'

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
      <div style={labelStyle}>{meta ? meta.name : 'ui viewer'}</div>
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
```

- [ ] **Step 4: Verify typecheck**

```bash
bun run typecheck
```
Expected: errors about DxfView, StlView, StepView not existing yet — that is expected at this step; the import errors will resolve in the next tasks. If there are OTHER errors, fix them.

- [ ] **Step 5: Commit**

```bash
git add viewer/index.html viewer/main.tsx viewer/ViewerApp.tsx
git commit -m "feat(viewer): add viewer HTML entry and ViewerApp shell"
```

---

### Task 5: DXF viewer component

**Files:**
- Create: `viewer/DxfView.tsx`

- [ ] **Step 1: Create viewer/DxfView.tsx**

```typescript
import { useEffect, useRef } from 'react'
import { DxfViewer } from 'dxf-viewer'
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
        progressCbk: (_phase: string, _size: number, _total: number) => {},
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
```

- [ ] **Step 2: Verify typecheck**

```bash
bun run typecheck
```
Expected: the DxfView import resolves. If `dxf-viewer` has no types, add `// @ts-expect-error no types` above the import and note it.

- [ ] **Step 3: Commit**

```bash
git add viewer/DxfView.tsx
git commit -m "feat(viewer): add DXF viewer component using dxf-viewer"
```

---

### Task 6: STL and STEP viewer components

**Files:**
- Create: `viewer/StlView.tsx`
- Create: `viewer/StepView.tsx`

- [ ] **Step 1: Create viewer/StlView.tsx**

```typescript
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(1, 2, 3)
    scene.add(dirLight)

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
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: 0x6688aa, specular: 0x222222, shininess: 40 })
      )
      scene.add(mesh)
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
```

- [ ] **Step 2: Create viewer/StepView.tsx**

```typescript
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface MeshAttributes {
  position: { array: number[] }
  normal?: { array: number[] }
}

interface OcctMesh {
  name: string
  color: [number, number, number] | null
  attributes: MeshAttributes
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(1, 2, 3)
    scene.add(dirLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

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

    fetch('/__pyseas/mesh')
      .then((r) => r.json() as Promise<OcctResult>)
      .then((data) => {
        if (!data.success) {
          setStatus(`STEP parse failed${data.error ? `: ${data.error}` : ''}`)
          return
        }

        const box = new THREE.Box3()

        for (const mesh of data.meshes) {
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(mesh.attributes.position.array), 3)
          )
          if (mesh.attributes.normal) {
            geometry.setAttribute(
              'normal',
              new THREE.BufferAttribute(new Float32Array(mesh.attributes.normal.array), 3)
            )
          } else {
            geometry.computeVertexNormals()
          }
          geometry.setIndex(
            new THREE.BufferAttribute(new Uint32Array(mesh.index.array), 1)
          )

          const [r, g, b] = mesh.color ?? [0.4, 0.53, 0.67]
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(r, g, b),
            specular: new THREE.Color(0.1, 0.1, 0.1),
            shininess: 40,
          })

          const obj = new THREE.Mesh(geometry, material)
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
        setStatus(`Error: ${String(e)}`)
      })

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {status && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ccc',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          {status}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify typecheck**

```bash
bun run typecheck
```
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add viewer/StlView.tsx viewer/StepView.tsx
git commit -m "feat(viewer): add STL and STEP viewer components using Three.js"
```

---

### Task 7: Run gates and smoke test

**Files:** none new — verification only

- [ ] **Step 1: Run full test suite**

```bash
bun test
```
Expected: all tests pass (viewer-cli tests + dockPaneLayout tests)

- [ ] **Step 2: Run typecheck**

```bash
bun run typecheck
```
Expected: 0 errors

- [ ] **Step 3: Run lint**

```bash
bun run lint
```
Expected: 0 errors. If `dxf-viewer` import raises a `no-explicit-any` or similar lint error, fix by adding the appropriate type cast.

- [ ] **Step 4: Manual smoke test — DXF**

Run from the ui directory:
```bash
PYTHONPATH=../pyseas-cad/src bun run bin/ui.mjs view ../pyseas-cad/examples/gallery/production_plate.dxf
```

Expected:
- Vite starts on `http://localhost:5173`
- Browser opens with viewer showing the DXF drawing (plate outline, hatching, dimensions)
- Pan and zoom work

- [ ] **Step 5: Manual smoke test — STL**

```bash
bun run bin/ui.mjs view ../pyseas-cad/examples/gallery/model_plate.stl
```

Expected:
- Browser opens with Three.js 3D view of the STL mesh
- Orbit controls work (drag to rotate, scroll to zoom)

- [ ] **Step 6: Manual smoke test — STEP**

```bash
bun run bin/ui.mjs view ../pyseas-cad/examples/gallery/production_plate.step
```

Expected:
- Browser opens, status overlay shows "Tessellating STEP file…"
- After a few seconds the two Prism meshes appear (plate + pin stud)
- Orbit controls work

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat(viewer): wire viewer gates — all tests pass, smoke tested"
```

---

## Acceptance Commands

```bash
bun test
bun run typecheck
bun run lint
bun run bin/ui.mjs view ../pyseas-cad/examples/gallery/production_plate.dxf
bun run bin/ui.mjs view ../pyseas-cad/examples/gallery/model_plate.stl
bun run bin/ui.mjs view ../pyseas-cad/examples/gallery/production_plate.step
```

## Notes for Implementer

- **dxf-viewer types:** If the package ships no `.d.ts`, Vite/TypeScript will complain. Add `declare module 'dxf-viewer'` to a `viewer/dxf-viewer.d.ts` shim file and reference it if needed.
- **occt-import-js WASM:** The WASM file is loaded automatically from `node_modules/occt-import-js/dist/`. No `locateFile` config needed in Node.js context.
- **TypedArray JSON:** The `serializeForJson` helper in `vite.viewer.config.ts` converts `Float32Array`/`Uint32Array` to plain `number[]` for JSON transport. The browser converts them back with `new Float32Array(array)`.
- **Three.js addons path:** Use `three/examples/jsm/loaders/STLLoader.js` and `three/examples/jsm/controls/OrbitControls.js` — these are the standard paths in the npm package.
- **Tessellation speed:** The `/__pyseas/mesh` endpoint is not cached. For large STEP files it may take 5–30 seconds. The "Tessellating STEP file…" overlay covers this wait.
