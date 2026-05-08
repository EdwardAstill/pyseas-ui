import type { CSSProperties } from 'react'
import styles from './fields.module.css'

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
  const inputCls = [styles.input, error ? styles.inputError : ''].filter(Boolean).join(' ')

  function handleChange(raw: string) {
    if (raw === '' || raw === '-') {
      onChange(null)
      return
    }
    const parsed = parseFloat(raw)
    onChange(isNaN(parsed) ? null : parsed)
  }

  return (
    <div className={styles.fieldRoot} style={style}>
      {label !== undefined && <label className={styles.label}>{label}</label>}
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
      {hint !== undefined && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
