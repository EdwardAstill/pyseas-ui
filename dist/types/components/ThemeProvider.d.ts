import { type ReactNode } from "react";
export type ThemeAppearanceName = "default" | "bun" | "compact";
export type ThemeColoringName = "dark" | "light" | "neon-pink" | "cobalt";
export type LegacyThemeName = "dark" | "light" | "high-contrast";
export type ThemeName = ThemeAppearanceName | ThemeColoringName | LegacyThemeName;
export type ThemeMode = "dark" | "light";
export interface ThemeContextValue {
    theme: ThemeAppearanceName;
    coloring: ThemeColoringName;
    mode: ThemeMode;
}
export declare function useTheme(): ThemeContextValue | undefined;
export interface ThemeProviderProps {
    theme: ThemeName;
    coloring?: ThemeName;
    overrides?: Record<string, string>;
    children: ReactNode;
}
export declare function ThemeProvider({ theme, coloring, overrides, children, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
