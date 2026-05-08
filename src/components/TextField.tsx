import type { CSSProperties } from 'react'
import styles from './fields.module.css'
import { cx } from './cx'
import { FieldRoot } from './FieldRoot'

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
  const inputCls = cx(styles.input, error && styles.inputError)

  return (
    <FieldRoot label={label} hint={hint} style={style}>
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
    </FieldRoot>
  )
}
