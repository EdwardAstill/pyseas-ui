/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'

export type ThemeName = 'default' | 'light' | 'dark' | 'bun' | 'high-contrast' | 'compact' | 'neon-pink' | 'cobalt'
export type ThemeMode = 'dark' | 'light'

export interface ThemeContextValue {
  theme: ThemeName
  coloring: ThemeName
  mode: ThemeMode
}

const ThemeCtx = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextValue | undefined {
  return useContext(ThemeCtx)
}

export interface ThemeProviderProps {
  theme: ThemeName
  coloring?: ThemeName
  overrides?: Record<string, string>
  children: ReactNode
}

const themeModes: Record<ThemeName, ThemeMode> = {
  default: 'dark',
  dark: 'dark',
  light: 'light',
  bun: 'dark',
  'high-contrast': 'dark',
  compact: 'dark',
  'neon-pink': 'dark',
  cobalt: 'light',
}

function resolveAppearanceTheme(theme: ThemeName): ThemeName {
  if (theme === 'light') return 'default'
  if (theme === 'high-contrast') return 'compact'
  if (theme === 'neon-pink') return 'bun'
  if (theme === 'cobalt') return 'default'
  return theme
}

function resolveThemeMode(theme: ThemeName): ThemeMode {
  return themeModes[theme]
}

export function ThemeProvider({ theme, coloring, overrides, children }: ThemeProviderProps) {
  const appearance = resolveAppearanceTheme(theme)
  const mode = resolveThemeMode(theme)
  const resolvedColoring = coloring ?? theme
  const style = overrides !== undefined
    ? { display: 'contents' as const, ...Object.fromEntries(Object.entries(overrides).map(([k, v]) => [k, v])) }
    : { display: 'contents' as const }
  return (
    <ThemeCtx.Provider value={{ theme: appearance, coloring: resolvedColoring, mode }}>
      <div
        data-theme={appearance}
        data-coloring={resolvedColoring}
        data-theme-mode={mode}
        style={style}
      >
        {children}
      </div>
    </ThemeCtx.Provider>
  )
}
