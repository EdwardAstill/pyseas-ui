import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  icon?: ReactNode
  children?: ReactNode
  title?: string
  autoFocus?: boolean
  style?: CSSProperties
}

const variantClass: Record<ButtonVariant, string> = {
  default: styles.variantDefault ?? '',
  primary: styles.variantPrimary ?? '',
  danger: styles.variantDanger ?? '',
  ghost: styles.variantGhost ?? '',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
}

export function Button({
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  icon,
  children,
  title,
  autoFocus,
  style,
}: ButtonProps) {
  const cls = [
    styles.button,
    sizeClass[size],
    variantClass[variant],
    loading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={cls}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      title={title}
      autoFocus={autoFocus}
      style={style}
      aria-busy={loading}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon !== undefined ? (
        <span className={styles.iconSlot} aria-hidden="true">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
