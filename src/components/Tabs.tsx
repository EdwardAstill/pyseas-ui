import styles from './Tabs.module.css'
import { cx } from './cx'

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  const cls = cx(styles.tabs, className)
  return (
    <div className={cls} role="tablist">
      {items.map((item) => {
        const isActive = item.value === value
        const isDisabled = item.disabled === true
        const tabCls = cx(styles.tab, isActive && styles.tabActive, isDisabled && styles.tabDisabled)
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            className={tabCls}
            onClick={() => {
              if (!isDisabled) onChange(item.value)
            }}
            type="button"
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
