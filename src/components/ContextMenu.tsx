import {
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./ContextMenu.module.css";
import { cx } from "./cx";
import { useTheme } from "./ThemeProvider";

export interface ContextMenuItem {
	label?: string;
	icon?: ReactNode;
	shortcut?: string;
	disabled?: boolean;
	onClick?: () => void;
	/**
	 * `"divider"` renders a horizontal separator. All other fields except `type` are ignored.
	 */
	type?: "item" | "divider";
}

export interface ContextMenuProps {
	items: ContextMenuItem[];
	/** Cursor X coordinate (e.g. `clientX` from a mouse event). */
	x: number;
	/** Cursor Y coordinate (e.g. `clientY` from a mouse event). */
	y: number;
	/** Called when the menu should close (Escape, click-outside, scroll, resize, or item selection). */
	onClose: () => void;
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
	const menuId = useId();
	const themeCtx = useTheme();

	// Indices of items that are keyboard-navigable (not dividers, not disabled)
	const actionableIndices = useMemo(
		() =>
			items
				.map((item, i) => (item.type !== "divider" && !item.disabled ? i : -1))
				.filter((i): i is number => i !== -1),
		[items],
	);

	// Auto-position: flip if overflowing viewport edges
	const [position, setPosition] = useState({ x, y });

	useEffect(() => {
		const menu = menuRef.current;
		if (menu === null) return;

		const rect = menu.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		let px = x;
		let py = y;

		if (x + rect.width > vw - 8) {
			px = Math.max(8, vw - rect.width - 8);
		}
		if (y + rect.height > vh - 8) {
			py = Math.max(8, vh - rect.height - 8);
		}

		setPosition({ x: px, y: py });
	}, [x, y]);

	// Close on outside-click, Escape, scroll, or resize
	const stableOnClose = useRef(onClose);
	stableOnClose.current = onClose;

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			const menu = menuRef.current;
			if (menu === null) return;
			if (!menu.contains(e.target as Node)) {
				stableOnClose.current();
			}
		}

		function handleKeyDown(e: globalThis.KeyboardEvent) {
			if (e.key === "Escape") {
				stableOnClose.current();
			}
		}

		function handleScroll() {
			stableOnClose.current();
		}

		function handleResize() {
			stableOnClose.current();
		}

		// requestAnimationFrame to avoid the same mouse-down that opened the menu from closing it
		const frame = requestAnimationFrame(() => {
			document.addEventListener("mousedown", handleClick);
			document.addEventListener("keydown", handleKeyDown);
			window.addEventListener("scroll", handleScroll, { once: true });
			window.addEventListener("resize", handleResize, { once: true });
		});

		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Focus the menu container so keyboard events work right away
	useEffect(() => {
		menuRef.current?.focus();
	}, []);

	function selectIndex(index: number) {
		const item = items[index];
		if (item === undefined || item.type === "divider" || item.disabled) return;
		item.onClick?.();
		onClose();
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (actionableIndices.length === 0) return;

		const currentPos =
			highlightedIndex >= 0 ? actionableIndices.indexOf(highlightedIndex) : -1;

		let nextPos = currentPos;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				nextPos =
					currentPos < actionableIndices.length - 1 ? currentPos + 1 : 0;
				break;
			case "ArrowUp":
				e.preventDefault();
				nextPos =
					currentPos > 0 ? currentPos - 1 : actionableIndices.length - 1;
				break;
			case "Home":
				e.preventDefault();
				nextPos = 0;
				break;
			case "End":
				e.preventDefault();
				nextPos = actionableIndices.length - 1;
				break;
			case "Enter":
				e.preventDefault();
				if (currentPos >= 0) {
					const idx = actionableIndices[currentPos];
					if (idx !== undefined) selectIndex(idx);
				}
				return;
			case "Escape":
				e.preventDefault();
				onClose();
				return;
			default:
				return;
		}

		const nextIdx = actionableIndices[nextPos];
		if (nextIdx !== undefined) {
			setHighlightedIndex(nextIdx);
		}
	}

	return createPortal(
		<div
			className={styles.overlay}
			aria-hidden="true"
			data-theme={themeCtx?.theme}
			data-coloring={themeCtx?.coloring}
			data-theme-mode={themeCtx?.mode}
		>
			<div
				ref={menuRef}
				role="menu"
				aria-labelledby={menuId}
				className={styles.menu}
				style={{ left: position.x, top: position.y }}
				tabIndex={-1}
				onKeyDown={handleKeyDown}
			>
				{items.map((item, index) => {
					if (item.type === "divider") {
						return (
							<div
								key={`divider-${index}`}
								className={styles.divider}
								role="separator"
							/>
						);
					}

					const isHighlighted = highlightedIndex === index;
					const isDisabled = item.disabled === true;

					return (
						<button
							key={`item-${index}`}
							type="button"
							role="menuitem"
							disabled={isDisabled}
							aria-disabled={isDisabled}
							className={cx(
								styles.item,
								isHighlighted && styles.itemHighlighted,
								isDisabled && styles.itemDisabled,
							)}
							onClick={() => {
								if (!isDisabled) selectIndex(index);
							}}
							onMouseEnter={() => setHighlightedIndex(index)}
							onMouseLeave={() => setHighlightedIndex(-1)}
						>
							{item.icon !== undefined && (
								<span
									className={cx(
										styles.itemIcon,
										isDisabled && styles.itemIconDisabled,
									)}
									aria-hidden="true"
								>
									{item.icon}
								</span>
							)}
							<span className={styles.itemLabel}>{item.label}</span>
							{item.shortcut !== undefined && (
								<span className={styles.itemShortcut}>{item.shortcut}</span>
							)}
						</button>
					);
				})}
			</div>
		</div>,
		document.body,
	);
}
