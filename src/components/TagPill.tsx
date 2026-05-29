import type { CSSProperties, MouseEventHandler } from "react";
import styles from "./TagPill.module.css";
import { cx } from "./cx";

export type TagPillVariant = "default" | "accent" | "status";
export type TagPillSize = "sm" | "md";

export interface TagPillProps {
	label: string;
	href?: string;
	onClick?: MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
	onRemove?: () => void;
	variant?: TagPillVariant;
	size?: TagPillSize;
	className?: string;
	style?: CSSProperties;
}

const variantClass: Record<TagPillVariant, string> = {
	default: styles.variantDefault ?? "",
	accent: styles.variantAccent ?? "",
	status: styles.variantStatus ?? "",
};

const sizeClass: Record<TagPillSize, string> = {
	sm: styles.pillSm ?? "",
	md: styles.pillMd ?? "",
};

export function TagPill({
	label,
	href,
	onClick,
	onRemove,
	variant = "default",
	size = "sm",
	className,
	style,
}: TagPillProps) {
	const cls = cx(
		styles.pill,
		sizeClass[size],
		variantClass[variant],
		onRemove !== undefined && styles.pillRemovable,
		className,
	);

	if (href !== undefined) {
		return (
			<a href={href} className={cls} onClick={onClick} style={style}>
				<span className={styles.label}>{label}</span>
				{onRemove !== undefined && (
					<button
						type="button"
						className={styles.removeButton}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onRemove();
						}}
						aria-label={`Remove ${label}`}
					>
						×
					</button>
				)}
			</a>
		);
	}

	return (
		<span className={cls} onClick={onClick} style={style}>
			<span className={styles.label}>{label}</span>
			{onRemove !== undefined && (
				<button
					type="button"
					className={styles.removeButton}
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					aria-label={`Remove ${label}`}
				>
					×
				</button>
			)}
		</span>
	);
}
