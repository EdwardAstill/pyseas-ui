# Plan: pyseas-ui demo CLI

**Spec:** none
**Created:** 2026-05-10T23:52Z
**Status:** approved
**Shape:** plan-execute-review
**Human checkpoints:** 0
**Refinement passes:** 1

## Goal

Add a first-class `pyseas-ui demo` command that starts the existing Vite examples/showcase with the requested flags:

```sh
pyseas-ui demo [--port <port>] [--host <host>] [--open] [--strict-port]
```

The command is a developer convenience wrapper around the existing showcase. It must not turn `pyseas-ui` into an app framework or add domain logic.

## Assumptions

- `A1` - Vite already serves `examples/` during dev-server mode through `vite.config.ts`.
  - Type: repo-state
  - Source: repo read
  - Check: `sed -n '1,80p' vite.config.ts | rg "root: isServe \\? 'examples' : '.'"`
  - If false: update the plan to add explicit Vite config selection for demo mode.
  - Owner: sub-task 2

- `A2` - A Node ESM bin wrapper is the smallest compatible CLI surface for this package.
  - Type: architectural
  - Source: `package.json` uses `"type": "module"` and Node/Bun toolchain
  - Check: `node --check bin/pyseas-ui.mjs`
  - If false: switch to a TypeScript-compiled CLI entry and add it to the build output.
  - Owner: sub-task 2

- `A3` - The CLI should remain private-workspace friendly and does not need to be included in `dist/`.
  - Type: policy
  - Source: README says package is private and consumed by local path/workspace links
  - Check: `node -e "const p=require('./package.json'); if (!p.private) process.exit(1)"`
  - If false: add release packaging checks for published CLI artifacts.
  - Owner: sub-task 4

## CLI Contract

### Command

```sh
pyseas-ui demo [--port <port>] [--host <host>] [--open] [--strict-port]
```

### Behavior

- `pyseas-ui demo` starts Vite using this package's existing config, which serves `examples/` as root.
- `--port <port>` forwards to Vite as `--port <port>`.
- `--host <host>` forwards to Vite as `--host <host>`.
- `--open` forwards to Vite as `--open`.
- `--strict-port` forwards to Vite as `--strictPort`.
- `-h` and `--help` print help to stdout and exit `0`.
- Unknown commands or flags print a concise error to stderr and exit `2`.
- Normal child failure exits `1` unless the child gives a specific non-signal exit code.
- `SIGINT` exits `130`.
- `SIGTERM` exits `143`.

### Output

- stdout is reserved for help text.
- stderr carries errors and Vite's server output.

## Sub-tasks

### Sub-task 1 - Confirm CLI contract against repository boundaries

**Block:** execute
**Skill:** system-designing
**Depends on:** (none)
**Assumption refs:** A1, A2, A3

**Instruction:**

Use the contract above as the implementation boundary. Confirm the command remains a demo/showcase launcher only, has no domain wording, and follows stdout/stderr and exit-code rules.

**Inputs (pre-staged):**
- file: README.md
- file: docs/ui-brief.md
- file: vite.config.ts
- file: package.json

**Acceptance:**
- `rg -n "padeye|lift condition|calculation|check result" bin package.json README.md docs tests examples src || true` -> no new matches in `bin/`, `package.json`, `README.md`, `docs/`, `tests/`, or `src/` introduced by CLI work
- `rg -n "pyseas-ui demo \\[--port <port>\\] \\[--host <host>\\] \\[--open\\] \\[--strict-port\\]" .warden/plans/2026-05-11-pyseas-ui-demo-cli-plan.md` -> exits 0

### Sub-task 2 - Implement the CLI wrapper

**Block:** execute
**Skill:** warden:typescript
**Depends on:** sub-task 1
**Assumption refs:** A1, A2

**Instruction:**

Create `bin/pyseas-ui.mjs`. Parse only `demo`, `--port`, `--host`, `--open`, `--strict-port`, `-h`, and `--help`. Spawn the local Vite binary with inherited stdio, this repo as cwd, and forwarded Vite flags. Handle `SIGINT` and `SIGTERM` by forwarding once to the child and exiting with `130` or `143` without printing a stack trace.

Update `package.json` with:

- `"bin": { "pyseas-ui": "./bin/pyseas-ui.mjs" }`
- `"scripts": { "demo": "pyseas-ui demo", ... }`

Do not change the library build output contract.

**Inputs (pre-staged):**
- file: package.json
- file: vite.config.ts
- create: bin/pyseas-ui.mjs

**Acceptance:**
- `test -x bin/pyseas-ui.mjs` -> exits 0
- `node --check bin/pyseas-ui.mjs` -> exits 0
- `node -e "const p=require('./package.json'); if (p.bin?.['pyseas-ui'] !== './bin/pyseas-ui.mjs') process.exit(1)"` -> exits 0
- `node -e "const p=require('./package.json'); if (p.scripts?.demo !== 'pyseas-ui demo') process.exit(1)"` -> exits 0
- `node bin/pyseas-ui.mjs --help | rg "pyseas-ui demo"` -> exits 0
- `node bin/pyseas-ui.mjs nope >/tmp/pyseas-ui-cli.out 2>/tmp/pyseas-ui-cli.err; test $? -eq 2` -> exits 0

### Sub-task 3 - Add CLI tests

**Block:** execute
**Skill:** warden:typescript
**Depends on:** sub-task 2
**Assumption refs:** A2

**Instruction:**

Add `tests/demoCli.test.ts` using Bun's test runner. Cover help output, unknown command/flag exit code `2`, forwarding of `--port`, `--host`, `--open`, and `--strict-port`, and quiet signal handling. Prefer testing argument building through an exported or injectable internal function only if it keeps the CLI simple; otherwise spawn the bin and use a test-only environment variable to print the computed Vite argv without starting a server.

**Inputs (pre-staged):**
- create: tests/demoCli.test.ts
- file: bin/pyseas-ui.mjs
- file: package.json

**Acceptance:**
- `bun test tests/demoCli.test.ts` -> 0 failures
- `bun test` -> 0 failures
- `rg -n "strictPort|--port|--host|--open" tests/demoCli.test.ts` -> exits 0
- `rg -n "SIGINT|130|SIGTERM|143" tests/demoCli.test.ts bin/pyseas-ui.mjs` -> exits 0

### Sub-task 4 - Update docs and package metadata

**Block:** execute
**Skill:** warden:writing
**Depends on:** sub-task 2, sub-task 3
**Assumption refs:** A3

**Instruction:**

Update README development docs to list both `bun run demo` and `pyseas-ui demo`. Document the available flags and state that the command serves `examples/` as the showcase. Keep the wording domain-neutral and consistent with the existing private package status.

If `files` in `package.json` would exclude the bin from local package consumers, add `bin` to the list.

**Inputs (pre-staged):**
- file: README.md
- file: package.json

**Acceptance:**
- `rg -n "bun run demo|pyseas-ui demo|--strict-port|--port <port>|--host <host>|--open" README.md` -> exits 0
- `node -e "const p=require('./package.json'); if (!p.files.includes('bin')) process.exit(1)"` -> exits 0
- `rg -n "padeye|lift condition|calculation|check result" README.md package.json bin tests || true` -> no new domain-specific CLI/docs wording

### Sub-task 5 - Final verification

**Block:** review
**Skill:** warden:verification-before-completion
**Depends on:** sub-task 1, sub-task 2, sub-task 3, sub-task 4
**Assumption refs:** A1, A2, A3

**Instruction:**

Run the final verification commands and inspect failures before reporting completion. Do not claim completion unless all commands pass or failures are explicitly documented with cause.

**Inputs (pre-staged):**
- file: package.json
- file: bin/pyseas-ui.mjs
- file: tests/demoCli.test.ts
- file: README.md

**Acceptance:**
- `bun run typecheck` -> exits 0
- `bun test` -> exits 0
- `bun run lint` -> exits 0
- `bun run build` -> exits 0
- `timeout 15s node bin/pyseas-ui.mjs demo --port 5178 --strict-port 2>/tmp/pyseas-ui-demo.log; code=$?; test "$code" -eq 124; rg "Local:" /tmp/pyseas-ui-demo.log` -> exits 0

