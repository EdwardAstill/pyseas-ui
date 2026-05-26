import type { CSSProperties } from "react";
import styles from "./Viewers.module.css";

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
	const lines = code.split("\n");

	return (
		<div className={styles.root} style={style}>
			{language !== undefined && (
				<div className={styles.langBadge}>{language}</div>
			)}
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
