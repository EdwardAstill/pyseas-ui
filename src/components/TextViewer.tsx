import type { CSSProperties } from "react";
import { LineBlock } from "./LineBlock";

export interface TextViewerProps {
	/** Plain text to display. */
	text: string;
	/** Show line numbers. Default: false. */
	showLineNumbers?: boolean;
	/** Maximum height before scrolling. Omit for auto-height. */
	maxHeight?: number;
	/** CSS overrides on the root element. */
	style?: CSSProperties;
}

export function TextViewer({
	text,
	showLineNumbers = false,
	maxHeight,
	style,
}: TextViewerProps) {
	return LineBlock({
		text,
		showLineNumbers,
		maxHeight,
		style,
	});
}
