import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: ModalSize
  children: ReactNode
}

const sizeClass: Record<ModalSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
}

export function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
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

  const dialogCls = [styles.dialog, sizeClass[size]].filter(Boolean).join(' ')

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
      >
        {(title !== undefined) && (
          <div className={styles.titleBar}>
            <span className={styles.title}>{title}</span>
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
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

/** @alias Modal */
export const Dialog = Modal
export type { ModalProps as DialogProps }
