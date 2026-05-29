import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Dialog.module.css";
import { cx } from "./cx";
import { useTheme } from "./ThemeProvider";

export type DialogSize = "sm" | "md" | "lg";

export interface DialogProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	titleActions?: ReactNode;
	footer?: ReactNode;
	size?: DialogSize;
	children: ReactNode;
	className?: string;
	"aria-label"?: string;
}

const sizeClass: Record<DialogSize, string> = {
	sm: styles.sm ?? "",
	md: styles.md ?? "",
	lg: styles.lg ?? "",
};

const focusableSelector = [
	"a[href]",
	"button:not([disabled])",
	"textarea:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	'[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableElements(root: HTMLElement): HTMLElement[] {
	return Array.from(
		root.querySelectorAll<HTMLElement>(focusableSelector),
	).filter(
		(element) =>
			!element.hasAttribute("disabled") &&
			element.getAttribute("aria-hidden") !== "true",
	);
}

export function Dialog({
	open,
	onClose,
	title,
	titleActions,
	footer,
	size = "md",
	children,
	className,
	"aria-label": ariaLabel,
}: DialogProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!open) return;

		previousFocusRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		function handleKeyDown(e: KeyboardEvent) {
			const dialog = dialogRef.current;
			if (e.key === "Escape") {
				onClose();
				return;
			}
			if (e.key !== "Tab" || dialog === null) return;

			const focusables = focusableElements(dialog);
			if (focusables.length === 0) {
				e.preventDefault();
				dialog.focus();
				return;
			}

			const first = focusables[0]!;
			const last = focusables[focusables.length - 1]!;
			const active = document.activeElement;

			if (e.shiftKey && (active === first || active === dialog)) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			previousFocusRef.current?.focus();
			previousFocusRef.current = null;
		};
	}, [open, onClose]);

	useEffect(() => {
		if (!open || dialogRef.current === null) return;

		const [first] = focusableElements(dialogRef.current);
		(first ?? dialogRef.current).focus();
	}, [open]);

	const themeCtx = useTheme();

	if (!open) return null;

	const dialogCls = cx(styles.dialog, sizeClass[size], className);
	const hasTitle = title !== undefined || titleActions !== undefined;
	const hasFooter = footer !== undefined && footer !== null;
	const labelledBy = title !== undefined ? titleId : undefined;

	return createPortal(
		<div
			className={styles.overlay}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			aria-modal="true"
			role="dialog"
			aria-labelledby={labelledBy}
			aria-label={
				labelledBy === undefined ? (ariaLabel ?? "Dialog") : ariaLabel
			}
			data-theme={themeCtx?.theme}
			data-coloring={themeCtx?.coloring}
			data-theme-mode={themeCtx?.mode}
		>
			<div
				ref={dialogRef}
				className={dialogCls}
				tabIndex={-1}
				onClick={(e) => e.stopPropagation()}
				data-ui="dialog"
			>
				{hasTitle && (
					<div className={styles.titleBar} data-ui="dialog-title-bar">
						{title !== undefined && (
							<span id={titleId} className={styles.title}>
								{title}
							</span>
						)}
						{titleActions !== undefined && (
							<div className={styles.titleActions}>{titleActions}</div>
						)}
						<button
							className={styles.closeButton}
							onClick={onClose}
							type="button"
							aria-label="Close"
						>
							✕
						</button>
					</div>
				)}
				<div className={styles.body} data-ui="dialog-body">
					{children}
				</div>
				{hasFooter && (
					<div className={styles.footer} data-ui="dialog-footer">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
