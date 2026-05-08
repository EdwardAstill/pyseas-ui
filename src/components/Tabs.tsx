import styles from './Tabs.module.css'

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
  const cls = [styles.tabs, className].filter(Boolean).join(' ')
  return (
    <div className={cls} role="tablist">
      {items.map((item) => {
        const isActive = item.value === value
        const isDisabled = item.disabled === true
        const tabCls = [
          styles.tab,
          isActive ? styles.tabActive : '',
          isDisabled ? styles.tabDisabled : '',
        ]
          .filter(Boolean)
          .join(' ')
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
