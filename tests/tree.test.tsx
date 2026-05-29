import { describe, expect, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Tree, type TreeNode } from "../src/index";

const nodes: TreeNode[] = [
	{
		id: "root",
		label: "Root",
		children: [
			{ id: "child-a", label: "Child A" },
			{ id: "child-b", label: "Child B" },
		],
	},
	{ id: "sibling", label: "Sibling" },
];

function TreeHarness() {
	const [expanded, setExpanded] = useState<Set<string>>(
		() => new Set(["root"]),
	);
	return (
		<Tree
			aria-label="Files"
			nodes={nodes}
			expanded={expanded}
			onExpandedChange={setExpanded}
			selected="root"
		/>
	);
}

describe("Tree", () => {
	test("supports vertical keyboard navigation", () => {
		render(<TreeHarness />);

		const root = screen.getByRole("treeitem", { name: "Root" });
		const childA = screen.getByRole("treeitem", { name: "Child A" });
		const sibling = screen.getByRole("treeitem", { name: "Sibling" });

		root.focus();
		fireEvent.keyDown(root, { key: "ArrowDown" });
		expect(document.activeElement).toBe(childA);

		fireEvent.keyDown(childA, { key: "End" });
		expect(document.activeElement).toBe(sibling);
	});

	test("collapses and expands branch rows with arrow keys", () => {
		render(<TreeHarness />);

		const root = screen.getByRole("treeitem", { name: "Root" });
		fireEvent.keyDown(root, { key: "ArrowLeft" });
		expect(screen.queryByRole("treeitem", { name: "Child A" })).toBeNull();

		fireEvent.keyDown(root, { key: "ArrowRight" });
		expect(screen.getByRole("treeitem", { name: "Child A" })).toBeTruthy();
	});
});
