import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isServe = command === 'serve'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        'opentype.js': resolve(__dirname, 'node_modules/opentype.js/dist/opentype.js'),
      },
    },

    // Dev server: serve the examples showcase
    root: isServe ? 'examples' : '.',

    build: isServe
      ? {}
      : {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Ui',
            fileName: (format) => `ui.${format}.js`,
            formats: ['es'],
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
          outDir: resolve(__dirname, 'dist'),
          emptyOutDir: true,
        },
  }
})
