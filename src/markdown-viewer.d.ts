declare module "markdown-it-texmath" {
	import type MarkdownIt from "markdown-it";
	import type katex from "katex";

	interface TexmathOptions {
		engine: typeof katex;
		delimiters?: string[];
		macros?: Record<string, string>;
	}

	function texmath(md: MarkdownIt, options: TexmathOptions): void;
	export = texmath;
}

declare module "katex/dist/katex.min.css";
