import type { ReactNode } from 'react'

export interface ThemeProviderProps {
  theme: 'dark' | 'light'
  children: ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <div data-theme={theme} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
