import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.css'
import iconStyles from './IconButton.module.css'
import { variantClass, sizeClass, type ButtonVariant, type ButtonSize } from './buttonClasses'
import { cx } from './cx'

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
  const cls = cx(styles.button, iconStyles.iconButton, sizeClass[size], variantClass[variant], loading && styles.loading)

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
