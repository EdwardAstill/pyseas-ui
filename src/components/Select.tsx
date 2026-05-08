import type { CSSProperties } from 'react'
import styles from './fields.module.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  label?: string
  style?: CSSProperties
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  label,
  style,
}: SelectProps) {
  const selectCls = [styles.select, error ? styles.selectError : ''].filter(Boolean).join(' ')

  return (
    <div className={styles.fieldRoot} style={style}>
      {label !== undefined && <label className={styles.label}>{label}</label>}
      <select
        className={selectCls}
        value={value === null ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={error === true}
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
