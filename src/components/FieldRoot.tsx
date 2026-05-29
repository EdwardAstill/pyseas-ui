import type { CSSProperties, ReactNode } from "react";
import styles from "./fields.module.css";

export interface FieldRootProps {
	label?: string | undefined;
	hint?: string | undefined;
	inputId?: string | undefined;
	hintId?: string | undefined;
	children: ReactNode;
	style?: CSSProperties | undefined;
}

export function FieldRoot({
	label,
	hint,
	inputId,
	hintId,
	children,
	style,
}: FieldRootProps) {
	const labelText = label !== undefined && (
		<span className={styles.label}>{label}</span>
	);
	const hintText = hint !== undefined && (
		<span id={hintId} className={styles.hint}>
			{hint}
		</span>
	);

	if (label !== undefined && inputId === undefined) {
		return (
			<label className={styles.fieldRoot} style={style}>
				{labelText}
				{children}
				{hintText}
			</label>
		);
	}

	return (
		<div className={styles.fieldRoot} style={style}>
			{label !== undefined && (
				<label className={styles.label} htmlFor={inputId}>
					{label}
				</label>
			)}
			{children}
			{hintText}
		</div>
	);
}
