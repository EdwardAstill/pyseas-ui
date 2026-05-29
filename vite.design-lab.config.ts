import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'design-lab'),
  resolve: {
    alias: {
      'opentype.js': resolve(__dirname, 'node_modules/opentype.js/dist/opentype.js'),
    },
  },
})
