import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Tabs, type TabItem } from "../src/index";

const items: TabItem[] = [
	{ value: "a", label: "Alpha" },
	{ value: "b", label: "Beta", disabled: true },
	{ value: "c", label: "Gamma" },
];

function TabsHarness() {
	const [value, setValue] = useState("a");
	return <Tabs items={items} value={value} onChange={setValue} />;
}

describe("Tabs", () => {
	test("uses roving focus and arrow-key activation", () => {
		render(<TabsHarness />);

		const alpha = screen.getByRole("tab", { name: "Alpha" });
		const gamma = screen.getByRole("tab", { name: "Gamma" });

		expect(alpha.getAttribute("tabindex")).toBe("0");
		expect(gamma.getAttribute("tabindex")).toBe("-1");

		alpha.focus();
		fireEvent.keyDown(alpha, { key: "ArrowRight" });

		expect(gamma.getAttribute("aria-selected")).toBe("true");
		expect(document.activeElement).toBe(gamma);
	});

	test("supports Home and End", () => {
		render(<TabsHarness />);

		const alpha = screen.getByRole("tab", { name: "Alpha" });
		const gamma = screen.getByRole("tab", { name: "Gamma" });

		alpha.focus();
		fireEvent.keyDown(alpha, { key: "End" });
		expect(gamma.getAttribute("aria-selected")).toBe("true");

		fireEvent.keyDown(gamma, { key: "Home" });
		expect(alpha.getAttribute("aria-selected")).toBe("true");
	});
});
