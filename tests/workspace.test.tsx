import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { Workspace, type LayoutNode } from "../src/index";

const layout: LayoutNode<"a" | "b"> = {
	type: "leaf",
	id: "leaf-1",
	tabs: ["a", "b"],
	activeTab: "a",
};

describe("Workspace", () => {
	test("supports keyboard tab activation", () => {
		render(
			<Workspace
				defaultLayout={layout}
				renderPanel={(tab) => <div>Panel {tab}</div>}
				renderTabLabel={(tab) => (tab === "a" ? "Alpha" : "Beta")}
			/>,
		);

		const alpha = screen.getByRole("tab", { name: "Alpha" });
		const beta = screen.getByRole("tab", { name: "Beta" });

		expect(alpha.getAttribute("aria-selected")).toBe("true");
		alpha.focus();
		fireEvent.keyDown(alpha, { key: "ArrowRight" });

		expect(beta.getAttribute("aria-selected")).toBe("true");
		expect(document.activeElement).toBe(beta);
		expect(screen.getByText("Panel b")).toBeTruthy();
	});
});
