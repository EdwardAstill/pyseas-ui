import type { CSSProperties } from 'react'
import styles from './fields.module.css'

export interface TextFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  label?: string
  hint?: string
  name?: string
  autoFocus?: boolean
  style?: CSSProperties
}

export function TextField({
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  error,
  label,
  hint,
  name,
  autoFocus,
  style,
}: TextFieldProps) {
  const inputCls = [styles.input, error ? styles.inputError : ''].filter(Boolean).join(' ')

  return (
    <div className={styles.fieldRoot} style={style}>
      {label !== undefined && <label className={styles.label}>{label}</label>}
      <input
        className={inputCls}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        autoFocus={autoFocus}
        aria-invalid={error === true}
      />
      {hint !== undefined && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
