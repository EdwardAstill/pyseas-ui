/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";

export type ThemeAppearanceName = "default" | "bun" | "compact";
export type ThemeColoringName = "dark" | "light" | "neon-pink" | "cobalt";
export type LegacyThemeName = "dark" | "light" | "high-contrast";
export type ThemeName =
	| ThemeAppearanceName
	| ThemeColoringName
	| LegacyThemeName;
export type ThemeMode = "dark" | "light";

export interface ThemeContextValue {
	theme: ThemeAppearanceName;
	coloring: ThemeColoringName;
	mode: ThemeMode;
}

const ThemeCtx = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue | undefined {
	return useContext(ThemeCtx);
}

export interface ThemeProviderProps {
	theme: ThemeName;
	coloring?: ThemeName;
	overrides?: Record<string, string>;
	children: ReactNode;
}

const coloringModes: Record<ThemeColoringName, ThemeMode> = {
	dark: "dark",
	light: "light",
	"neon-pink": "dark",
	cobalt: "light",
};

function resolveAppearanceTheme(theme: ThemeName): ThemeAppearanceName {
	if (theme === "bun" || theme === "neon-pink") return "bun";
	if (theme === "compact" || theme === "high-contrast") return "compact";
	return "default";
}

function resolveColoring(theme: ThemeName): ThemeColoringName {
	if (theme === "light") return "light";
	if (theme === "bun" || theme === "neon-pink") return "neon-pink";
	if (theme === "compact" || theme === "cobalt") return "cobalt";
	return "dark";
}

export function ThemeProvider({
	theme,
	coloring,
	overrides,
	children,
}: ThemeProviderProps) {
	const appearance = resolveAppearanceTheme(theme);
	const resolvedColoring = resolveColoring(coloring ?? theme);
	const mode = coloringModes[resolvedColoring];
	const style =
		overrides !== undefined
			? {
					display: "contents" as const,
					...Object.fromEntries(
						Object.entries(overrides).map(([key, value]) => [key, value]),
					),
				}
			: { display: "contents" as const };

	return (
		<ThemeCtx.Provider
			value={{ theme: appearance, coloring: resolvedColoring, mode }}
		>
			<div
				data-theme={appearance}
				data-coloring={resolvedColoring}
				data-theme-mode={mode}
				style={style}
			>
				{children}
			</div>
		</ThemeCtx.Provider>
	);
}
