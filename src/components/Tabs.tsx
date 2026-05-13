import { Fragment } from 'react'

import styles from './Tabs.module.css'
import { cx } from './cx'

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsMarker = 'underline' | 'bracket' | 'slash'

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  orientation?: TabsOrientation
  marker?: TabsMarker
  className?: string
}

export function Tabs({
  items,
  value,
  onChange,
  orientation = 'horizontal',
  marker = 'underline',
  className,
}: TabsProps) {
  const cls = cx(
    styles.tabs,
    orientation === 'vertical' && styles.tabsVertical,
    marker === 'bracket' && styles.tabsBracket,
    marker === 'slash' && styles.tabsSlash,
    className,
  )
  return (
    <div className={cls} role="tablist" aria-orientation={orientation}>
      {items.map((item, index) => {
        const isActive = item.value === value
        const isDisabled = item.disabled === true
        const tabCls = cx(styles.tab, isActive && styles.tabActive, isDisabled && styles.tabDisabled)
        return (
          <Fragment key={item.value}>
            {marker === 'slash' && index > 0 && (
              <span className={styles.slashSep} aria-hidden="true">/</span>
            )}
            <button
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
              {marker === 'bracket' ? (
                <>
                  <span className={styles.bracket} aria-hidden="true">[</span>
                  <span>{item.label}</span>
                  <span className={styles.bracket} aria-hidden="true">]</span>
                </>
              ) : (
                item.label
              )}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}
