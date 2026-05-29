import type { CSSProperties, ReactNode } from 'react'
import styles from './AppShell.module.css'
import { cx } from './cx'

export interface AppShellProps {
  topbar?: ReactNode
  sidebar?: ReactNode
  statusbar?: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export interface TopBarProps {
  title?: ReactNode
  subtitle?: ReactNode
  left?: ReactNode
  right?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export interface IconSidebarItem {
  id: string
  label: string
  icon: ReactNode
  disabled?: boolean
  title?: string
}

export interface IconSidebarProps {
  items: IconSidebarItem[]
  activeItem?: string
  onItemSelect?: (id: string) => void
  brand?: ReactNode
  footerItems?: IconSidebarItem[]
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export interface StatusBarProps {
  left?: ReactNode
  right?: ReactNode
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function AppShell({ topbar, sidebar, statusbar, children, className, style }: AppShellProps) {
  return (
    <div className={cx(styles.appShell, className)} style={style}>
      {topbar !== undefined && <div className={styles.topbarSlot}>{topbar}</div>}
      <div className={styles.mainRow}>
        {sidebar !== undefined && <div className={styles.sidebarSlot}>{sidebar}</div>}
        <main className={styles.contentSlot}>{children}</main>
      </div>
      {statusbar !== undefined && <div className={styles.statusbarSlot}>{statusbar}</div>}
    </div>
  )
}

export function TopBar({
  title,
  subtitle,
  left,
  right,
  children,
  className,
  style,
}: TopBarProps) {
  return (
    <header className={cx(styles.topbar, className)} style={style}>
      {children ?? (
        <>
          {left}
          {title !== undefined && <span className={styles.title}>{title}</span>}
          {subtitle !== undefined && <span className={styles.subtitle}>{subtitle}</span>}
          <span className={styles.spacer} />
          {right}
        </>
      )}
    </header>
  )
}

export function IconSidebar({
  items,
  activeItem,
  onItemSelect,
  brand,
  footerItems = [],
  className,
  style,
  'aria-label': ariaLabel = 'Workspace navigation',
}: IconSidebarProps) {
  return (
    <nav className={cx(styles.iconSidebar, className)} style={style} aria-label={ariaLabel}>
      {brand !== undefined && <div className={styles.sidebarBrand}>{brand}</div>}
      <div className={styles.sidebarItems}>{items.map((item) => renderSidebarButton(item, activeItem, onItemSelect))}</div>
      <div className={styles.sidebarSpacer} />
      {footerItems.length > 0 && (
        <div className={styles.sidebarItems}>
          {footerItems.map((item) => renderSidebarButton(item, activeItem, onItemSelect))}
        </div>
      )}
    </nav>
  )
}

export function StatusBar({ left, right, children, className, style }: StatusBarProps) {
  return (
    <footer className={cx(styles.statusbar, className)} style={style}>
      {children ?? (
        <>
          {left}
          <span className={styles.spacer} />
          {right}
        </>
      )}
    </footer>
  )
}

function renderSidebarButton(
  item: IconSidebarItem,
  activeItem: string | undefined,
  onItemSelect: ((id: string) => void) | undefined,
) {
  const isActive = item.id === activeItem

  return (
    <button
      aria-label={item.label}
      aria-pressed={isActive}
      className={cx(styles.sidebarButton, isActive && styles.sidebarButtonActive)}
      disabled={item.disabled}
      key={item.id}
      onClick={() => onItemSelect?.(item.id)}
      title={item.title ?? item.label}
      type="button"
    >
      <span aria-hidden="true" className={styles.sidebarIcon}>
        {item.icon}
      </span>
    </button>
  )
}
