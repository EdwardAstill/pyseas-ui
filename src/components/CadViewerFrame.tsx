/* eslint-disable react-refresh/only-export-components */
import {
	useEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactNode,
	type Ref,
	type RefObject,
} from "react";

import { cx } from "./cx";
import styles from "./CadViewer.module.css";
import type {
	CadViewerDownload,
	CadViewerStatus,
	CadViewerTheme,
} from "./CadViewerTypes";

export const DARK_BG = 0x1a1a1a;
export const LIGHT_BG = 0xf5f5f5;

interface CadViewerFrameProps {
	title?: ReactNode;
	metadata?: ReactNode;
	download?: CadViewerDownload | null;
	children: ReactNode;
	className?: string | undefined;
	style?: CSSProperties | undefined;
	frameRef?: Ref<HTMLDivElement>;
	theme?: CadViewerTheme;
}

export function resolvedStatus(
	sourceUrl: string | null | undefined,
	status: CadViewerStatus | undefined,
): CadViewerStatus {
	if (status !== undefined) return status;
	return sourceUrl === null || sourceUrl === undefined || sourceUrl.length === 0
		? "idle"
		: "ready";
}

export function displayMessage(
	status: CadViewerStatus,
	error: string | null | undefined,
	emptyMessage: string,
	loadingMessage: string,
): string | null {
	if (status === "idle") return emptyMessage;
	if (status === "loading") return loadingMessage;
	if (status === "error") return error ?? "CAD preview failed";
	return null;
}

function detectTheme(element: HTMLElement | null): CadViewerTheme {
	if (typeof window === "undefined" || element === null) return "dark";
	const themed = element.closest("[data-theme]") as HTMLElement | null;
	const mode = themed?.dataset.themeMode;
	return mode === "light" ? "light" : "dark";
}

export function useCadTheme(theme: CadViewerTheme | undefined): {
	frameRef: RefObject<HTMLDivElement | null>;
	activeTheme: CadViewerTheme;
} {
	const frameRef = useRef<HTMLDivElement>(null);
	const [autoTheme, setAutoTheme] = useState<CadViewerTheme>("dark");
	const activeTheme: CadViewerTheme = theme ?? autoTheme;

	useEffect(() => {
		if (theme !== undefined) return;
		const frame = frameRef.current;
		if (frame === null) return;
		setAutoTheme(detectTheme(frame));
		const themed = frame.closest("[data-theme]");
		if (themed === null) return;
		const observer = new MutationObserver(() =>
			setAutoTheme(detectTheme(frame)),
		);
		observer.observe(themed, {
			attributes: true,
			attributeFilter: ["data-theme", "data-theme-mode", "data-coloring"],
		});
		return () => observer.disconnect();
	}, [theme]);

	return { frameRef, activeTheme };
}

export function CadViewerFrame({
	title,
	metadata,
	download = null,
	children,
	className,
	style,
	frameRef,
	theme,
}: CadViewerFrameProps) {
	const hasToolbar =
		title !== undefined || metadata !== undefined || download !== null;

	return (
		<div
			ref={frameRef}
			className={cx(styles.viewer, className)}
			style={style}
			data-pyseas-ui="cad-viewer"
			data-cad-theme={theme}
		>
			{hasToolbar && (
				<div className={styles.toolbar}>
					{title !== undefined && <span className={styles.title}>{title}</span>}
					{metadata !== undefined && (
						<span className={styles.metadata}>{metadata}</span>
					)}
					{download !== null && (
						<a
							className={styles.downloadLink}
							href={download.href}
							download={download.filename}
						>
							{download.label ?? "Download"}
						</a>
					)}
				</div>
			)}
			<div className={styles.viewport}>{children}</div>
		</div>
	);
}

export function StateText({
	message,
	isError = false,
}: {
	message: string | null;
	isError?: boolean;
}) {
	if (message === null) return null;
	return (
		<div className={cx(styles.stateText, isError && styles.stateTextError)}>
			{message}
		</div>
	);
}
