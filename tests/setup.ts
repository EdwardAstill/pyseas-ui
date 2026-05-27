import { afterEach } from "bun:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
	url: "http://localhost",
});

// Polyfill globals needed by @testing-library/react.
const g = globalThis as Record<string, unknown>;
g.document = dom.window.document;
g.window = dom.window;

afterEach(() => {
	dom.window.document.body.replaceChildren();
});
