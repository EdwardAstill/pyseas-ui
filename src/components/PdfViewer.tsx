import type { CSSProperties } from "react";
import styles from "./Viewers.module.css";

export interface PdfViewerProps {
	/** URL to the PDF file. */
	src: string;
	/** Height in pixels. Default: 600. */
	height?: number;
	/** Accessible title for the iframe. Defaults to "PDF viewer". */
	title?: string;
	/** CSS overrides on the root element. */
	style?: CSSProperties;
}

export function PdfViewer({
	src,
	height = 600,
	title = "PDF viewer",
	style,
}: PdfViewerProps) {
	return (
		<div className={styles.root} style={style}>
			<div className={styles.pdfWrap} style={{ height }}>
				<iframe
					src={src}
					title={title}
					sandbox="allow-same-origin allow-scripts"
				/>
			</div>
		</div>
	);
}
