import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Dialog.module.css'
import { cx } from './cx'
import { useTheme } from './ThemeProvider'

export type DialogSize = 'sm' | 'md' | 'lg'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  titleActions?: ReactNode
  footer?: ReactNode
  size?: DialogSize
  children: ReactNode
  className?: string
}

const sizeClass: Record<DialogSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
}

export function Dialog({
  open,
  onClose,
  title,
  titleActions,
  footer,
  size = 'md',
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open && dialogRef.current !== null) {
      dialogRef.current.focus()
    }
  }, [open])

  const themeCtx = useTheme()

  if (!open) return null

  const dialogCls = cx(styles.dialog, sizeClass[size], className)
  const hasTitle = title !== undefined || titleActions !== undefined
  const hasFooter = footer !== undefined && footer !== null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-modal="true"
      role="dialog"
      data-theme={themeCtx?.theme}
      data-coloring={themeCtx?.coloring}
      data-theme-mode={themeCtx?.mode}
    >
      <div
        ref={dialogRef}
        className={dialogCls}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        data-pyseas-ui="dialog"
      >
        {hasTitle && (
          <div className={styles.titleBar} data-pyseas-ui="dialog-title-bar">
            <span className={styles.title}>{title}</span>
            {titleActions !== undefined && (
              <div className={styles.titleActions}>{titleActions}</div>
            )}
            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className={styles.body} data-pyseas-ui="dialog-body">{children}</div>
        {hasFooter && (
          <div className={styles.footer} data-pyseas-ui="dialog-footer">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
