import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./CommandPalette.module.css";
import { cx } from "./cx";
import { useTheme } from "./ThemeProvider";

export interface CommandPaletteItem {
	id: string;
	label: string;
	description?: string;
	icon?: ReactNode;
	keywords?: string[];
	onSelect: () => void;
}

export interface CommandPaletteProps {
	open: boolean;
	onClose: () => void;
	items: CommandPaletteItem[];
	placeholder?: string;
	emptyMessage?: string;
	className?: string;
	style?: CSSProperties;
}

export function CommandPalette({
	open,
	onClose,
	items,
	placeholder = "Search…",
	emptyMessage = "No results.",
	className,
	style,
}: CommandPaletteProps) {
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const themeCtx = useTheme();
	const listId = useId();

	// Reset state on open
	useEffect(() => {
		if (open) {
			setQuery("");
			setActiveIndex(0);
		}
	}, [open]);

	// Focus the input when the palette opens
	useEffect(() => {
		if (!open) return;

		previousFocusRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		// Small delay so the portal is mounted
		const frame = requestAnimationFrame(() => {
			inputRef.current?.focus();
		});

		return () => {
			cancelAnimationFrame(frame);
			previousFocusRef.current?.focus();
			previousFocusRef.current = null;
		};
	}, [open]);

	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (q === "") return items;

		return items.filter((item) => {
			const label = item.label.toLowerCase();
			const desc = (item.description ?? "").toLowerCase();
			const keywords = (item.keywords ?? []).join(" ").toLowerCase();
			return label.includes(q) || desc.includes(q) || keywords.includes(q);
		});
	}, [items, query]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
					break;
				case "Home":
					e.preventDefault();
					setActiveIndex(0);
					break;
				case "End":
					e.preventDefault();
					setActiveIndex(filtered.length - 1);
					break;
				case "Enter":
					e.preventDefault();
					if (filtered.length > 0 && activeIndex >= 0) {
						const item = filtered[activeIndex];
						if (item !== undefined) {
							item.onSelect();
							onClose();
						}
					}
					break;
				case "Escape":
					e.preventDefault();
					onClose();
					break;
			}
		},
		[filtered, activeIndex, onClose],
	);

	// Scroll active item into view
	useEffect(() => {
		const list = listRef.current;
		if (list === null) return;
		const active = list.children[activeIndex] as HTMLElement | undefined;
		active?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	const stableOnClose = useRef(onClose);
	stableOnClose.current = onClose;

	// Close on mousedown outside
	useEffect(() => {
		if (!open) return;

		const containerRef = { current: listRef.current?.parentElement ?? null };

		function handleClick(e: MouseEvent) {
			if (
				containerRef.current !== null &&
				!containerRef.current.contains(e.target as Node)
			) {
				stableOnClose.current();
			}
		}

		// Delay so the open click doesn't immediately close
		const frame = requestAnimationFrame(() => {
			document.addEventListener("mousedown", handleClick);
		});

		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("mousedown", handleClick);
		};
	}, [open]);

	if (!open) return null;

	return createPortal(
		<div
			className={styles.overlay}
			aria-hidden="true"
			data-theme={themeCtx?.theme}
			data-coloring={themeCtx?.coloring}
			data-theme-mode={themeCtx?.mode}
		>
			<div
				className={cx(styles.palette, className)}
				role="dialog"
				aria-modal="true"
				aria-label="Command palette"
				style={style}
			>
				<div className={styles.inputWrapper}>
					<span className={styles.searchIcon} aria-hidden="true">
						⌕
					</span>
					<input
						ref={inputRef}
						type="text"
						className={styles.input}
						placeholder={placeholder}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setActiveIndex(0);
						}}
						onKeyDown={handleKeyDown}
						aria-controls={listId}
						aria-activedescendant={
							filtered.length > 0 && activeIndex >= 0
								? `cp-result-${filtered[activeIndex]!.id}`
								: undefined
						}
						role="combobox"
						aria-expanded="true"
						aria-autocomplete="list"
					/>
				</div>
				<div
					ref={listRef}
					id={listId}
					className={styles.results}
					role="listbox"
				>
					{filtered.length === 0 && (
						<div className={styles.empty}>{emptyMessage}</div>
					)}
					{filtered.map((item, index) => {
						const isActive = index === activeIndex;
						return (
							<button
								key={item.id}
								id={`cp-result-${item.id}`}
								type="button"
								role="option"
								aria-selected={isActive}
								className={cx(styles.result, isActive && styles.resultActive)}
								onClick={() => {
									item.onSelect();
									onClose();
								}}
								onMouseEnter={() => setActiveIndex(index)}
							>
								{item.icon !== undefined && (
									<span className={styles.resultIcon} aria-hidden="true">
										{item.icon}
									</span>
								)}
								<div className={styles.resultText}>
									<span className={styles.resultLabel}>{item.label}</span>
									{item.description !== undefined && (
										<span className={styles.resultDescription}>
											{item.description}
										</span>
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>,
		document.body,
	);
}
