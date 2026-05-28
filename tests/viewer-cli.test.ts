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
