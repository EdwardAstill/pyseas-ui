import { useEffect, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import styles from "./Lightbox.module.css";
import { cx } from "./cx";
import { useTheme } from "./ThemeProvider";

export interface LightboxProps {
	open: boolean;
	onClose: () => void;
	src: string;
	alt?: string;
	className?: string;
	style?: CSSProperties;
}

export function Lightbox({
	open,
	onClose,
	src,
	alt,
	className,
	style,
}: LightboxProps) {
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const themeCtx = useTheme();

	useEffect(() => {
		if (!open) return;

		previousFocusRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onClose();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			previousFocusRef.current?.focus();
			previousFocusRef.current = null;
		};
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<div
			className={cx(styles.overlay, className)}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			role="dialog"
			aria-modal="true"
			aria-label={alt ?? "Image viewer"}
			data-theme={themeCtx?.theme}
			data-coloring={themeCtx?.coloring}
			data-theme-mode={themeCtx?.mode}
			style={style}
		>
			<button
				type="button"
				className={styles.closeButton}
				onClick={onClose}
				aria-label="Close"
			>
				✕
			</button>
			<img src={src} alt={alt ?? ""} className={styles.image} />
		</div>,
		document.body,
	);
}
