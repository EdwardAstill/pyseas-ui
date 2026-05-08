export const PARTS = [
  { id: 'part-a', label: 'Part A' },
  { id: 'part-b', label: 'Part B' },
  { id: 'part-c', label: 'Part C' },
  { id: 'sling-1', label: 'Sling 1' },
  { id: 'sling-2', label: 'Sling 2' },
]

export const STANDARDS = [
  { value: 'std-a', label: 'Standard A (2023)' },
  { value: 'std-b', label: 'Standard B (2021)' },
  { value: 'std-c', label: 'Standard C (2019)' },
]

export const CONDITIONS = [
  { value: 'cond-1', label: 'Condition 1 — static' },
  { value: 'cond-2', label: 'Condition 2 — dynamic' },
  { value: 'cond-3', label: 'Condition 3 — accidental' },
]

export const MATERIAL_OPTIONS = [
  { value: 'mat-a', label: 'Grade 355' },
  { value: 'mat-b', label: 'Grade 250' },
  { value: 'mat-c', label: 'Grade 690' },
]

export const DEMO_LOG_LINES = [
  '[INFO]  Initialising analysis engine',
  '[INFO]  Loading part geometry',
  '[INFO]  Applying load conditions',
  '[WARN]  Utilisation ratio approaching limit: 0.94',
  '[INFO]  Running checks for Standard A',
  '[OK]    Check 1.1 — PASS (ratio: 0.71)',
  '[OK]    Check 1.2 — PASS (ratio: 0.63)',
  '[FAIL]  Check 2.1 — FAIL (ratio: 1.04)',
  '[INFO]  Analysis complete',
]
