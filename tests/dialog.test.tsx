import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Dialog } from "../src/index";

function DialogHarness() {
	const [open, setOpen] = useState(true);
	return (
		<>
			<button type="button">Before</button>
			<Dialog open={open} onClose={() => setOpen(false)} title="Settings">
				<button type="button">First</button>
				<button type="button">Last</button>
			</Dialog>
		</>
	);
}

describe("Dialog", () => {
	test("labels the dialog from its title", () => {
		render(<DialogHarness />);

		const dialog = screen.getByRole("dialog", { name: "Settings" });
		expect(dialog.getAttribute("aria-modal")).toBe("true");
	});

	test("traps tab focus and closes on Escape", () => {
		render(<DialogHarness />);

		const close = screen.getByRole("button", { name: "Close" });
		const last = screen.getByRole("button", { name: "Last" });
		last.focus();

		fireEvent.keyDown(document, { key: "Tab" });
		expect(document.activeElement).toBe(close);

		fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
		expect(document.activeElement).toBe(last);

		fireEvent.keyDown(document, { key: "Escape" });
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
