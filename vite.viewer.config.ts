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
        const filePath = process.env['PYSEAS_VIEW_FILE'] ?? ''
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'PYSEAS_VIEW_FILE not set' }))
          return
        }
        const name = filePath.split('/').pop() ?? filePath
        const dot = filePath.lastIndexOf('.')
        const format = dot === -1 ? '' : filePath.slice(dot + 1).toLowerCase()
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ format, name, path: filePath }))
      })

      server.middlewares.use('/__pyseas/file', (_req, res) => {
        const filePath = process.env['PYSEAS_VIEW_FILE'] ?? ''
        if (!filePath) {
          res.statusCode = 400
          res.end('PYSEAS_VIEW_FILE not set')
          return
        }
        const buf = readFileSync(filePath)
        const name = filePath.split('/').pop() ?? 'file'
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Disposition', `inline; filename="${name}"`)
        res.end(buf)
      })

      server.middlewares.use('/__pyseas/mesh', async (_req, res) => {
        const filePath = process.env['PYSEAS_VIEW_FILE'] ?? ''
        if (!filePath) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'PYSEAS_VIEW_FILE not set' }))
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
  resolve: {
    alias: {
      'opentype.js': resolve(__dirname, 'node_modules/opentype.js/dist/opentype.js'),
    },
  },
  optimizeDeps: {
    exclude: ['occt-import-js'],
  },
})
