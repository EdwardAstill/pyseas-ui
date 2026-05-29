import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { TextViewer } from "../src/components/TextViewer";

type ElementWithChildren = ReactElement<{
	children?: unknown;
	"aria-hidden"?: string | boolean;
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

function isPre(el: unknown): boolean {
	if (!el || typeof el !== "object") return false;
	return (el as { type?: string }).type === "pre";
}

describe("TextViewer", () => {
	test("renders text content", () => {
		const el = render(TextViewer({ text: "Hello world" }));
		const pre = findDescendant(el, (c) => isPre(c));
		expect(pre).toBeDefined();
		const content = findDescendant(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { type?: string; props?: { children?: string } };
			return obj.type === "span" && obj.props?.children === "Hello world";
		});
		expect(content).toBeDefined();
	});

	test("no line numbers by default", () => {
		const el = render(TextViewer({ text: "line1\nline2" }));
		const hiddenSpans = countElements(el, (c) => isSpan(c) && hasAriaHidden(c));
		expect(hiddenSpans).toBe(0);
	});

	test("shows line numbers when enabled", () => {
		const el = render(TextViewer({ text: "a\nb\nc", showLineNumbers: true }));
		const hiddenSpans = countElements(el, (c) => isSpan(c) && hasAriaHidden(c));
		expect(hiddenSpans).toBe(3);
	});

	test("renders multiple lines", () => {
		const el = render(TextViewer({ text: "a\nb" }));
		// Count spans with text content (line content spans)
		const contentSpans = countElements(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { type?: string; props?: { children?: string } };
			return obj.type === "span" && obj.props?.children !== undefined;
		});
		// 2 line content spans (line numbers off by default, so only content spans)
		expect(contentSpans).toBe(2);
	});
});
