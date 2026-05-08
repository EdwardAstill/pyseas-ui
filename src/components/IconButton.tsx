import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.css'
import iconStyles from './IconButton.module.css'
import type { ButtonVariant, ButtonSize } from './Button'

export interface IconButtonProps {
  icon: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  title: string
  type?: 'button' | 'submit' | 'reset'
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

export function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  title,
  type = 'button',
  style,
}: IconButtonProps) {
  const cls = [
    styles.button,
    iconStyles.iconButton,
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
      aria-label={title}
      aria-busy={loading}
      style={style}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.iconSlot} aria-hidden="true">{icon}</span>
      )}
    </button>
  )
}
