import { type ReactNode } from 'react';
export type ThemeName = 'default' | 'light' | 'dark' | 'bun' | 'high-contrast' | 'compact' | 'neon-pink' | 'cobalt';
export type ThemeMode = 'dark' | 'light';
export interface ThemeContextValue {
    theme: ThemeName;
    coloring: ThemeName;
    mode: ThemeMode;
}
export declare function useTheme(): ThemeContextValue | undefined;
export interface ThemeProviderProps {
    theme: ThemeName;
    coloring?: ThemeName;
    overrides?: Record<string, string>;
    children: ReactNode;
}
export declare function ThemeProvider({ theme, coloring, overrides, children }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
