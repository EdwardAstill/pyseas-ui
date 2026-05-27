/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

import styles from "./App.module.css";

export function classNames(...values: Array<string | false | undefined>) {
	return values.filter(Boolean).join(" ");
}

interface DocSectionProps {
	title: string;
	children: ReactNode;
}

function sectionIdFromTitle(title: string) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function sourceLabelFromPath(source: string) {
	return source.split("/").pop() ?? source;
}

export function DocSection({ title, children }: DocSectionProps) {
	return (
		<section id={sectionIdFromTitle(title)} className={styles.section}>
			<h2 className={styles.sectionTitle}>{title}</h2>
			{children}
		</section>
	);
}

interface ComponentBlockProps {
	name: string;
	source: string;
	meta: string;
	children: ReactNode;
}

export function ComponentBlock({
	name,
	source,
	meta,
	children,
}: ComponentBlockProps) {
	return (
		<article className={styles.componentBlock}>
			<div className={styles.componentHeader}>
				<div>
					<h3 className={styles.componentName}>{name}</h3>
					<p className={styles.componentMeta}>{meta}</p>
				</div>
				<code className={styles.componentSource} title={source}>
					{sourceLabelFromPath(source)}
				</code>
			</div>
			<div className={styles.componentBody}>{children}</div>
		</article>
	);
}
