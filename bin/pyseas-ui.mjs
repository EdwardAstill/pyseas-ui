#!/usr/bin/env bun
import { resolve } from 'node:path'

const packageRoot = resolve(import.meta.dir, '..')

const helpText = `pyseas-ui - developer tools for pyseas-ui

USAGE:
  pyseas-ui demo [--port <port>] [--host <host>] [--open] [--strict-port]
  pyseas-ui view <file>
  pyseas-ui --help

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
  pyseas-ui demo
  pyseas-ui demo --open
  pyseas-ui view plate.dxf
  pyseas-ui view model.step
  pyseas-ui view part.stl
`

function usageError(message) {
  process.stderr.write(`${message}\nRun \`pyseas-ui --help\` for usage.\n`)
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
    usageError(`unsupported format \`${ext}\`; supported: .dxf, .stl, .step, .stp`)
  }
  return resolve(filePath)
}

function resolveDemoCommand(viteArgs) {
  if (process.env.PYSEAS_UI_DEMO_CHILD_JSON) {
    const parsed = JSON.parse(process.env.PYSEAS_UI_DEMO_CHILD_JSON)
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
      usageError('invalid PYSEAS_UI_DEMO_CHILD_JSON')
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

  if (process.env.PYSEAS_UI_DEMO_PRINT_ARGS === '1') {
    process.stdout.write(`${JSON.stringify({ cwd: packageRoot, viteArgs })}\n`)
    return
  }

  if (!demoCommand[0]) usageError('missing demo command')

  await spawnAndWait(demoCommand, childEnvForDemo(viteArgs))
}

async function runView(rawArgs) {
  const absPath = parseViewArgs(rawArgs)

  if (process.env.PYSEAS_UI_VIEW_PRINT_ARGS === '1') {
    process.stdout.write(`${absPath}\n`)
    return
  }

  const command = ['bun', 'run', 'vite', '--config', 'vite.viewer.config.ts', '--open']
  const env = { ...process.env, PYSEAS_VIEW_FILE: absPath }
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
