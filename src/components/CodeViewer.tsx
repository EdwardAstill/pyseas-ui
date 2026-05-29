import type { CSSProperties } from "react";
import { LineBlock } from "./LineBlock";

export interface CodeViewerProps {
	/** Source code to display. */
	code: string;
	/** Language identifier shown in the badge. */
	language?: string;
	/** Show line numbers. Default: true. */
	showLineNumbers?: boolean;
	/** Maximum height before scrolling. Omit for auto-height. */
	maxHeight?: number;
	/** CSS overrides on the root element. */
	style?: CSSProperties;
}

export function CodeViewer({
	code,
	language,
	showLineNumbers = true,
	maxHeight,
	style,
}: CodeViewerProps) {
	return LineBlock({
		text: code,
		showLineNumbers,
		maxHeight,
		badge: language,
		style,
	});
}
