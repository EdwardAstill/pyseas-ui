import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../src/components/ThemeProvider";

function ThemeProbe() {
	const theme = useTheme();
	return (
		<div
			data-testid="probe"
			data-theme-value={theme?.theme}
			data-coloring-value={theme?.coloring}
			data-mode-value={theme?.mode}
		/>
	);
}

describe("ThemeProvider", () => {
	test("composes appearance and coloring", () => {
		render(
			<ThemeProvider theme="compact" coloring="light">
				<ThemeProbe />
			</ThemeProvider>,
		);

		const provider = screen.getByTestId("probe").parentElement;
		expect(provider?.dataset.theme).toBe("compact");
		expect(provider?.dataset.coloring).toBe("light");
		expect(provider?.dataset.themeMode).toBe("light");

		const probe = screen.getByTestId("probe");
		expect(probe.dataset.themeValue).toBe("compact");
		expect(probe.dataset.coloringValue).toBe("light");
		expect(probe.dataset.modeValue).toBe("light");
	});

	test("keeps legacy single-value theme names working", () => {
		render(
			<ThemeProvider theme="high-contrast">
				<ThemeProbe />
			</ThemeProvider>,
		);

		const provider = screen.getByTestId("probe").parentElement;
		expect(provider?.dataset.theme).toBe("compact");
		expect(provider?.dataset.coloring).toBe("dark");
		expect(provider?.dataset.themeMode).toBe("dark");
	});
});
