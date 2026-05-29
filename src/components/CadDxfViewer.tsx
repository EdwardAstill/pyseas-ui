import { useEffect, useRef, useState } from "react";
import { DxfViewer } from "dxf-viewer";
import * as THREE from "three";

import {
	CadViewerFrame,
	DARK_BG,
	LIGHT_BG,
	StateText,
	displayMessage,
	resolvedStatus,
	useCadTheme,
} from "./CadViewerFrame";
import styles from "./CadViewer.module.css";
import type { CadDxfViewerProps } from "./CadViewerTypes";

export function CadDxfViewer({
	fileUrl = null,
	status,
	error = null,
	emptyMessage = "No DXF preview",
	loadingMessage = "Loading DXF preview",
	title,
	metadata,
	download = null,
	clearColor,
	theme,
	className,
	style,
}: CadDxfViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { frameRef, activeTheme } = useCadTheme(theme);
	const [viewerError, setViewerError] = useState<string | null>(null);
	const resolvedClearColor =
		clearColor ?? (activeTheme === "light" ? LIGHT_BG : DARK_BG);
	const currentStatus = resolvedStatus(fileUrl, status);
	const message =
		viewerError ??
		displayMessage(currentStatus, error, emptyMessage, loadingMessage);

	useEffect(() => {
		const container = containerRef.current;
		if (
			!container ||
			currentStatus !== "ready" ||
			fileUrl === null ||
			fileUrl.length === 0
		)
			return;

		setViewerError(null);
		let cancelled = false;
		// Defer creation by a tick so React StrictMode's synchronous mount→cleanup
		// pair doesn't tear down a half-loaded DxfWorker (which leaves the canvas
		// blank because the cancelled Load promise rejects on a null worker).
		let viewer: InstanceType<typeof DxfViewer> | null = null;
		const timer = window.setTimeout(() => {
			if (cancelled) return;
			viewer = new DxfViewer(container, {
				clearColor: new THREE.Color(resolvedClearColor),
				autoResize: true,
				// dxf-viewer's blackWhiteInversion flips white↔black after the DXF color
				// map. For a light theme background we want DXF "white" entities drawn
				// dark; for a dark background we want them drawn light. Toggle accordingly.
				blackWhiteInversion: activeTheme === "light",
			});
			viewer
				.Load({ url: fileUrl, progressCbk: () => {} })
				.catch((loadError: unknown) => {
					if (cancelled) return;
					setViewerError(
						loadError instanceof Error ? loadError.message : String(loadError),
					);
				});
		}, 0);

		return () => {
			cancelled = true;
			window.clearTimeout(timer);
			if (viewer !== null) {
				try {
					viewer.Destroy();
				} catch {
					// dxf-viewer 1.0.47 races with in-flight Load(); cleanup is best-effort.
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStatus, fileUrl]);

	return (
		<CadViewerFrame
			title={title}
			metadata={metadata}
			download={download}
			className={className}
			style={style}
			frameRef={frameRef}
			theme={activeTheme}
		>
			<div ref={containerRef} className={styles.mount} />
			<StateText
				message={message}
				isError={currentStatus === "error" || viewerError !== null}
			/>
		</CadViewerFrame>
	);
}
