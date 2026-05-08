import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import styles from './fields.module.css'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  style?: CSSProperties
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  indeterminate,
  style,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.indeterminate = indeterminate === true
    }
  }, [indeterminate])

  const rootCls = [styles.checkboxRoot, disabled ? styles.checkboxDisabled : '']
    .filter(Boolean)
    .join(' ')

  return (
    <label className={rootCls} style={style}>
      <input
        ref={inputRef}
        className={styles.checkboxInput}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label !== undefined && <span className={styles.checkboxLabel}>{label}</span>}
    </label>
  )
}
