import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { CodeViewer } from "../src/components/CodeViewer";

type ElementWithChildren = ReactElement<{
	children?: unknown;
	"aria-hidden"?: string;
}>;

function render(el: ReactElement): ReactElement {
	return el;
}

function findDescendant(
	el: unknown,
	test: (child: unknown) => boolean,
): unknown {
	if (!el || typeof el !== "object") return undefined;
	const obj = el as ElementWithChildren;
	if (test(obj)) return obj;
	if (obj.props && typeof obj.props === "object" && "children" in obj.props) {
		const children = (obj.props as { children: unknown }).children;
		if (Array.isArray(children)) {
			for (const child of children) {
				const found = findDescendant(child, test);
				if (found !== undefined) return found;
			}
		} else if (children !== undefined) {
			return findDescendant(children, test);
		}
	}
	return undefined;
}

function countElements(el: unknown, test: (child: unknown) => boolean): number {
	let count = 0;
	if (!el || typeof el !== "object") return count;
	if (test(el)) count++;
	const obj = el as ElementWithChildren;
	if (obj.props && typeof obj.props === "object" && "children" in obj.props) {
		const children = (obj.props as { children: unknown }).children;
		if (Array.isArray(children)) {
			for (const child of children) {
				count += countElements(child, test);
			}
		} else if (children !== undefined) {
			count += countElements(children, test);
		}
	}
	return count;
}

function isSpan(el: unknown): boolean {
	if (!el || typeof el !== "object") return false;
	return (el as { type?: string }).type === "span";
}

function hasAriaHidden(el: unknown): boolean {
	if (!el || typeof el !== "object") return false;
	const obj = el as { props?: { "aria-hidden"?: string | boolean } };
	const v = obj.props?.["aria-hidden"];
	return v === true || v === "true";
}

function isElementType(el: unknown, type: string): boolean {
	if (!el || typeof el !== "object") return false;
	return (el as { type?: string }).type === type;
}

describe("CodeViewer", () => {
	test("renders code content", () => {
		const el = render(CodeViewer({ code: "const x = 1;" }));
		const pre = findDescendant(el, (c) => isElementType(c, "pre"));
		expect(pre).toBeDefined();
		const code = findDescendant(el, (c) => isElementType(c, "code"));
		expect(code).toBeDefined();
	});

	test("shows line numbers by default", () => {
		const el = render(CodeViewer({ code: "line1\nline2" }));
		// Line numbers are spans with aria-hidden
		const hiddenSpans = countElements(el, (c) => isSpan(c) && hasAriaHidden(c));
		expect(hiddenSpans).toBe(2);
	});

	test("hides line numbers when showLineNumbers=false", () => {
		const el = render(
			CodeViewer({ code: "line1\nline2", showLineNumbers: false }),
		);
		const hiddenSpans = countElements(el, (c) => isSpan(c) && hasAriaHidden(c));
		expect(hiddenSpans).toBe(0);
	});

	test("shows language badge", () => {
		const el = render(CodeViewer({ code: "x = 1", language: "python" }));
		const badge = findDescendant(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { type?: string; props?: { children?: string } };
			return obj.type === "div" && obj.props?.children === "python";
		});
		expect(badge).toBeDefined();
	});

	test("renders empty lines with placeholder", () => {
		const el = render(CodeViewer({ code: "a\n\nb" }));
		const spaceEls = countElements(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { type?: string; props?: { children?: string } };
			return obj.type === "span" && obj.props?.children === " ";
		});
		expect(spaceEls).toBeGreaterThanOrEqual(1);
	});
});
