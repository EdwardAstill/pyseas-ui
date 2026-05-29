import { Fragment, type CSSProperties } from "react";
import styles from "./Breadcrumb.module.css";
import { cx } from "./cx";

export interface BreadcrumbItem {
	label: string;
	onClick?: () => void;
	href?: string;
	disabled?: boolean;
}

export interface BreadcrumbProps {
	items: BreadcrumbItem[];
	separator?: "/" | "›" | ">" | string;
	maxItems?: number;
	className?: string;
	style?: CSSProperties;
}

export function Breadcrumb({
	items,
	separator = "/",
	maxItems,
	className,
	style,
}: BreadcrumbProps) {
	const truncated = maxItems !== undefined && items.length > maxItems;
	let display: BreadcrumbItem[];
	let ellipsisIndex = -1;

	if (truncated) {
		// Show first + ellipsis + last
		ellipsisIndex = 1;
		display = [items[0]!, ...items.slice(-(maxItems! - 1))];
	} else {
		display = items;
	}

	return (
		<nav
			className={cx(styles.breadcrumb, className)}
			aria-label="Breadcrumb"
			style={style}
		>
			{display.map((item, index) => {
				const isLast = index === display.length - 1;
				const showSeparator = !isLast || (truncated && ellipsisIndex >= 0);

				return (
					<Fragment key={index}>
						{truncated && index === ellipsisIndex && (
							<span className={styles.ellipsis} aria-hidden="true">
								…
							</span>
						)}
						{item.href !== undefined && !isLast ? (
							<a
								href={item.href}
								className={cx(
									styles.item,
									styles.link,
									item.disabled && styles.itemDisabled,
								)}
								aria-disabled={item.disabled}
								onClick={(e) => {
									if (item.disabled) {
										e.preventDefault();
										return;
									}
									item.onClick?.();
								}}
							>
								{item.label}
							</a>
						) : (
							<button
								type="button"
								className={cx(
									styles.item,
									isLast && styles.itemLast,
									item.disabled && styles.itemDisabled,
								)}
								disabled={item.disabled}
								aria-disabled={item.disabled}
								aria-current={isLast ? "page" : undefined}
								onClick={() => {
									if (!item.disabled) item.onClick?.();
								}}
							>
								{item.label}
							</button>
						)}
						{showSeparator && (
							<span className={styles.separator} aria-hidden="true">
								{separator}
							</span>
						)}
					</Fragment>
				);
			})}
		</nav>
	);
}
