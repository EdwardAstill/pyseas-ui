import { mkdirSync, writeFileSync } from 'node:fs'

const declaration = [
  'declare const stylesheet: string',
  'export default stylesheet',
  '',
].join('\n')

mkdirSync('dist/types', { recursive: true })
writeFileSync('dist/pyseas-ui.d.css.ts', declaration)
writeFileSync('dist/types/styles.d.css.ts', declaration)
