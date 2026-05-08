import type { CSSProperties } from 'react'
import styles from './fields.module.css'

export interface ToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  style?: CSSProperties
}

export function Toggle({ value, onChange, label, disabled, size = 'md', style }: ToggleProps) {
  const sizeClass = size === 'sm' ? styles.toggleSm : styles.toggleMd
  const rootCls = [styles.toggleRoot, sizeClass, disabled ? styles.toggleDisabled : '']
    .filter(Boolean)
    .join(' ')
  const trackCls = [styles.toggleTrack, value ? styles.toggleTrackOn : '']
    .filter(Boolean)
    .join(' ')
  const thumbCls = [styles.toggleThumb, value ? styles.toggleThumbOn : '']
    .filter(Boolean)
    .join(' ')

  return (
    <label className={rootCls} style={style}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        aria-checked={value}
        role="switch"
      />
      <span className={trackCls} aria-hidden="true">
        <span className={thumbCls} />
      </span>
      {label !== undefined && <span className={styles.toggleLabel}>{label}</span>}
    </label>
  )
}
