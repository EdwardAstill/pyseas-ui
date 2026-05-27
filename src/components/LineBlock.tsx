import type { CSSProperties, ReactNode } from "react";
import styles from "./Viewers.module.css";

interface LineBlockProps {
	text: string;
	showLineNumbers: boolean;
	maxHeight?: number | undefined;
	badge?: ReactNode | undefined;
	style?: CSSProperties | undefined;
}

export function LineBlock({
	text,
	showLineNumbers,
	maxHeight,
	badge,
	style,
}: LineBlockProps) {
	const lines = text.split("\n");

	return (
		<div className={styles.root} style={style}>
			{badge !== undefined && <div className={styles.langBadge}>{badge}</div>}
			<div className={styles.codeWrap} style={{ maxHeight }}>
				<pre className={styles.lineNumbers}>
					<code>
						{lines.map((line, index) => {
							const lineNumber = index + 1;
							return (
								<div className={styles.lineRow} key={lineNumber}>
									{showLineNumbers && (
										<span className={styles.lineNum} aria-hidden>
											{lineNumber}
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
