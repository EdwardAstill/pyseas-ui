import type {
	CSSProperties,
	PointerEvent as ReactPointerEvent,
	WheelEvent as ReactWheelEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { cx } from "./cx";
import styles from "./DrawingViewer.module.css";

export interface SvgViewerProps {
	/** Raw SVG markup string. */
	svg: string;
	/** Accessible label for the SVG. */
	label?: string;
	/** CSS class on the root element. */
	className?: string;
	/** CSS overrides on the root element. */
	style?: CSSProperties;
}

interface DragState {
	pointerId: number;
	originX: number;
	originY: number;
	panX: number;
	panY: number;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 6;
const ZOOM_STEP = 1.2;

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function SvgViewer({ svg, label, className, style }: SvgViewerProps) {
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const dragRef = useRef<DragState | null>(null);

	useEffect(() => {
		setZoom(1);
		setPan({ x: 0, y: 0 });
	}, [svg]);

	function resetView() {
		setZoom(1);
		setPan({ x: 0, y: 0 });
	}

	function zoomBy(factor: number) {
		setZoom((current) => clamp(current * factor, MIN_ZOOM, MAX_ZOOM));
	}

	function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
		event.preventDefault();
		zoomBy(event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
	}

	function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
		if (event.button !== 0) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		dragRef.current = {
			pointerId: event.pointerId,
			originX: event.clientX,
			originY: event.clientY,
			panX: pan.x,
			panY: pan.y,
		};
	}

	function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
		const drag = dragRef.current;
		if (drag === null || drag.pointerId !== event.pointerId) return;
		setPan({
			x: drag.panX + event.clientX - drag.originX,
			y: drag.panY + event.clientY - drag.originY,
		});
	}

	function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
		const drag = dragRef.current;
		if (drag === null || drag.pointerId !== event.pointerId) return;
		dragRef.current = null;
		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
	}

	return (
		<div
			className={cx(styles.viewer, className)}
			style={style}
			data-ui="svg-viewer"
		>
			<div className={styles.toolbar}>
				<div className={styles.toolbarGroup}>
					<IconButton
						title="Zoom out"
						size="sm"
						icon={<span>−</span>}
						onClick={() => zoomBy(1 / ZOOM_STEP)}
					/>
					<IconButton
						title="Zoom in"
						size="sm"
						icon={<span>+</span>}
						onClick={() => zoomBy(ZOOM_STEP)}
					/>
					<Button size="sm" onClick={resetView}>
						Fit
					</Button>
				</div>
				<div className={styles.toolbarMeta}>
					<span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
				</div>
			</div>

			<div
				className={cx(styles.viewport, styles.interactive)}
				onWheel={handleWheel}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
			>
				<div
					className={styles.canvas}
					style={{
						transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
					}}
				>
					<div
						className={styles.svgSlot}
						role="img"
						aria-label={label ?? "SVG preview"}
						// Raw SVG is caller-supplied drawing content; callers should sanitize untrusted SVG before passing it here.
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				</div>
			</div>
		</div>
	);
}
