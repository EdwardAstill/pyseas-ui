import type { CSSProperties } from 'react'
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
  const inputCls = cx(styles.input, error && styles.inputError)

  function handleChange(raw: string) {
    if (raw === '' || raw === '-') {
      onChange(null)
      return
    }
    const parsed = parseFloat(raw)
    onChange(isNaN(parsed) ? null : parsed)
  }

  return (
    <FieldRoot label={label} hint={hint} style={style}>
      <input
        className={inputCls}
        type="number"
        value={value === null ? '' : String(value)}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error === true}
      />
    </FieldRoot>
  )
}
