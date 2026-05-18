import type { ChangeEvent, CSSProperties, KeyboardEvent, WheelEvent } from 'react'
import styles from './fields.module.css'
import { cx } from './cx'
import { FieldRoot } from './FieldRoot'

export interface NumberFieldProps {
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  label?: string
  hint?: string
  style?: CSSProperties
}

export function NumberField({
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  disabled,
  readOnly,
  error,
  label,
  hint,
  style,
}: NumberFieldProps) {
  const inputCls = cx(styles.input, styles.numberInput, error && styles.inputError)
  const displayValue = value === null ? '' : String(value)

  function commitValue(next: number | null) {
    if (next === null) {
      onChange(null)
      return
    }

    const boundedMin = min === undefined ? next : Math.max(min, next)
    const bounded = max === undefined ? boundedMin : Math.min(max, boundedMin)
    onChange(bounded)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.currentTarget.value.trim()

    if (raw === '' || raw === '-' || raw === '.' || raw === '-.') {
      onChange(null)
      return
    }

    if (!/^-?\d*(?:\.\d*)?$/.test(raw)) {
      event.currentTarget.value = displayValue
      return
    }

    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) {
      event.currentTarget.value = displayValue
      return
    }

    commitValue(parsed)
  }

  function decimalPlaces(value: number): number {
    const [, decimal = ''] = String(value).split('.')
    return decimal.length
  }

  function stepValue(direction: 1 | -1) {
    const stepValue = step ?? 1
    const current = value ?? 0
    const next = current + direction * stepValue
    const precision = Math.min(decimalPlaces(stepValue), 10)
    commitValue(precision === 0 ? next : Number(next.toFixed(precision)))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled === true || readOnly === true) return
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

    event.preventDefault()
    stepValue(event.key === 'ArrowUp' ? 1 : -1)
  }

  function handleWheel(event: WheelEvent<HTMLInputElement>) {
    if (disabled === true || readOnly === true) return
    if (document.activeElement !== event.currentTarget) return
    if (event.deltaY === 0) return

    event.preventDefault()
    stepValue(event.deltaY < 0 ? 1 : -1)
  }

  return (
    <FieldRoot label={label} hint={hint} style={style}>
      <input
        className={inputCls}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error === true}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value ?? undefined}
      />
    </FieldRoot>
  )
}
