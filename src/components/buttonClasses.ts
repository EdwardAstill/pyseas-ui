import styles from './Button.module.css'

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export const variantClass: Record<ButtonVariant, string> = {
  default: styles.variantDefault ?? '',
  primary: styles.variantPrimary ?? '',
  danger: styles.variantDanger ?? '',
  ghost: styles.variantGhost ?? '',
}

export const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
}
