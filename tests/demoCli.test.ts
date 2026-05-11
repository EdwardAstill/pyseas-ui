import { expect, test } from 'bun:test'
import { resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const cli = resolve(root, 'bin/pyseas-ui.mjs')

type RunResult = {
  exitCode: number
  stdout: string
  stderr: string
}

async function runCli(args: string[], env: Record<string, string> = {}): Promise<RunResult> {
  const proc = Bun.spawn({
    cmd: [process.execPath, cli, ...args],
    cwd: root,
    env: { ...process.env, ...env },
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])

  return { exitCode, stdout, stderr }
}

test('prints help', async () => {
  const result = await runCli(['--help'])

  expect(result.exitCode).toBe(0)
  expect(result.stdout).toContain('pyseas-ui demo [--port <port>] [--host <host>] [--open] [--strict-port]')
  expect(result.stderr).toBe('')
})

test('rejects unknown command with usage exit code', async () => {
  const result = await runCli(['nope'])

  expect(result.exitCode).toBe(2)
  expect(result.stdout).toBe('')
  expect(result.stderr).toContain('unknown command `nope`')
})

test('rejects unknown demo option with usage exit code', async () => {
  const result = await runCli(['demo', '--bad'])

  expect(result.exitCode).toBe(2)
  expect(result.stdout).toBe('')
  expect(result.stderr).toContain('unknown option `--bad`')
})

test('forwards demo flags to Vite', async () => {
  const result = await runCli(['demo', '--port', '5178', '--host', '127.0.0.1', '--open', '--strict-port'], {
    PYSEAS_UI_DEMO_PRINT_ARGS: '1',
  })

  expect(result.exitCode).toBe(0)
  expect(result.stderr).toBe('')
  expect(JSON.parse(result.stdout)).toEqual({
    cwd: root,
    viteArgs: ['--port', '5178', '--host', '127.0.0.1', '--open', '--strictPort'],
  })
})

test('forwards SIGINT and exits 130 quietly', async () => {
  const childScript = `
    process.on('SIGINT', () => process.exit(0));
    setInterval(() => {}, 1000);
  `

  const proc = Bun.spawn({
    cmd: [process.execPath, cli, 'demo'],
    cwd: root,
    env: {
      ...process.env,
      PYSEAS_UI_DEMO_CHILD_JSON: JSON.stringify([process.execPath, '-e', childScript]),
    },
    stdout: 'pipe',
    stderr: 'pipe',
  })

  await Bun.sleep(100)
  proc.kill('SIGINT')

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])

  expect(exitCode).toBe(130)
  expect(stdout).toBe('')
  expect(stderr).toBe('')
})

test('forwards SIGTERM and exits 143 quietly', async () => {
  const childScript = `
    process.on('SIGTERM', () => process.exit(0));
    setInterval(() => {}, 1000);
  `

  const proc = Bun.spawn({
    cmd: [process.execPath, cli, 'demo'],
    cwd: root,
    env: {
      ...process.env,
      PYSEAS_UI_DEMO_CHILD_JSON: JSON.stringify([process.execPath, '-e', childScript]),
    },
    stdout: 'pipe',
    stderr: 'pipe',
  })

  await Bun.sleep(100)
  proc.kill('SIGTERM')

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])

  expect(exitCode).toBe(143)
  expect(stdout).toBe('')
  expect(stderr).toBe('')
})
