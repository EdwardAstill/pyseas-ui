import type { CSSProperties } from "react";
import styles from "./Viewers.module.css";

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
	const lines = text.split("\n");

	return (
		<div className={styles.root} style={style}>
			<div className={styles.codeWrap} style={{ maxHeight }}>
				<pre className={styles.lineNumbers}>
					<code>
						{lines.map((line, i) => {
							const num = i + 1;
							return (
								<div className={styles.lineRow} key={num}>
									{showLineNumbers && (
										<span className={styles.lineNum} aria-hidden>
											{num}
										</span>
									)}
									<span className={styles.lineContent}>{line || " "}</span>
								</div>
							);
						})}
					</code>
				</pre>
			</div>
		</div>
	);
}
