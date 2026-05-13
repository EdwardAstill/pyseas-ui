import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'
import { cx } from './cx'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  titleActions?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  children: ReactNode
  className?: string
}

const sizeClass: Record<ModalSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
}

export function Modal({
  open,
  onClose,
  title,
  titleActions,
  footer,
  size = 'md',
  children,
  className,
}: ModalProps) {
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
    >
      <div
        ref={dialogRef}
        className={dialogCls}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        data-pyseas-ui="modal"
      >
        {hasTitle && (
          <div className={styles.titleBar} data-pyseas-ui="modal-title-bar">
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
        <div className={styles.body} data-pyseas-ui="modal-body">{children}</div>
        {hasFooter && (
          <div className={styles.footer} data-pyseas-ui="modal-footer">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}

/** @alias Modal */
export const Dialog = Modal
export type { ModalProps as DialogProps }
