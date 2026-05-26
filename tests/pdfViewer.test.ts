import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { PdfViewer } from "../src/components/PdfViewer";

type ElementWithChildren = ReactElement<{ children?: unknown }>;

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

describe("PdfViewer", () => {
	test("renders iframe with src", () => {
		const el = render(PdfViewer({ src: "/docs/test.pdf" }));
		const iframe = findDescendant(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { type?: string; props?: { src?: string } };
			return obj.type === "iframe" && obj.props?.src === "/docs/test.pdf";
		});
		expect(iframe).toBeDefined();
	});

	test("renders with default height", () => {
		const el = render(PdfViewer({ src: "/test.pdf" }));
		// Height is applied as a style prop on the wrap div
		const wrap = findDescendant(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { props?: { style?: { height?: number } } };
			return obj.props?.style?.height === 600;
		});
		expect(wrap).toBeDefined();
	});

	test("uses custom height", () => {
		const el = render(PdfViewer({ src: "/test.pdf", height: 800 }));
		const wrap = findDescendant(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { props?: { style?: { height?: number } } };
			return obj.props?.style?.height === 800;
		});
		expect(wrap).toBeDefined();
	});

	test("uses title as iframe title", () => {
		const el = render(PdfViewer({ src: "/test.pdf", title: "My doc" }));
		const iframe = findDescendant(el, (c) => {
			if (!c || typeof c !== "object") return false;
			const obj = c as { type?: string; props?: { title?: string } };
			return obj.type === "iframe" && obj.props?.title === "My doc";
		});
		expect(iframe).toBeDefined();
	});
});
