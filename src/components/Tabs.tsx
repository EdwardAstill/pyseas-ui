import { Fragment, type KeyboardEvent } from "react";

import styles from "./Tabs.module.css";
import { cx } from "./cx";

export interface TabItem {
	value: string;
	label: string;
	disabled?: boolean;
}

export type TabsOrientation = "horizontal" | "vertical";
export type TabsMarker = "underline" | "bracket" | "slash";

export interface TabsProps {
	items: TabItem[];
	value: string;
	onChange: (value: string) => void;
	orientation?: TabsOrientation;
	marker?: TabsMarker;
	className?: string;
}

export function Tabs({
	items,
	value,
	onChange,
	orientation = "horizontal",
	marker = "underline",
	className,
}: TabsProps) {
	const cls = cx(
		styles.tabs,
		orientation === "vertical" && styles.tabsVertical,
		marker === "bracket" && styles.tabsBracket,
		marker === "slash" && styles.tabsSlash,
		className,
	);

	function selectByOffset(
		currentValue: string,
		offset: 1 | -1,
		trigger: HTMLButtonElement,
	) {
		const enabledItems = items.filter((item) => item.disabled !== true);
		if (enabledItems.length === 0) return;

		const currentIndex = Math.max(
			0,
			enabledItems.findIndex((item) => item.value === currentValue),
		);
		const nextIndex =
			(currentIndex + offset + enabledItems.length) % enabledItems.length;
		const nextItem = enabledItems[nextIndex];
		if (nextItem === undefined) return;

		onChange(nextItem.value);
		focusTabButton(trigger, nextItem.value);
	}

	function selectEdge(edge: "first" | "last", trigger: HTMLButtonElement) {
		const enabledItems = items.filter((item) => item.disabled !== true);
		const nextItem =
			edge === "first"
				? enabledItems[0]
				: enabledItems[enabledItems.length - 1];
		if (nextItem === undefined) return;

		onChange(nextItem.value);
		focusTabButton(trigger, nextItem.value);
	}

	function handleKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		item: TabItem,
	) {
		if (item.disabled === true) return;

		const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
		const previousKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

		if (event.key === nextKey) {
			event.preventDefault();
			selectByOffset(item.value, 1, event.currentTarget);
		} else if (event.key === previousKey) {
			event.preventDefault();
			selectByOffset(item.value, -1, event.currentTarget);
		} else if (event.key === "Home") {
			event.preventDefault();
			selectEdge("first", event.currentTarget);
		} else if (event.key === "End") {
			event.preventDefault();
			selectEdge("last", event.currentTarget);
		}
	}

	return (
		<div className={cls} role="tablist" aria-orientation={orientation}>
			{items.map((item, index) => {
				const isActive = item.value === value;
				const isDisabled = item.disabled === true;
				const tabCls = cx(
					styles.tab,
					isActive && styles.tabActive,
					isDisabled && styles.tabDisabled,
				);
				return (
					<Fragment key={item.value}>
						{marker === "slash" && index > 0 && (
							<span className={styles.slashSep} aria-hidden="true">
								/
							</span>
						)}
						<button
							role="tab"
							aria-selected={isActive}
							aria-disabled={isDisabled}
							disabled={isDisabled}
							className={tabCls}
							data-tab-value={item.value}
							onClick={() => {
								if (!isDisabled) onChange(item.value);
							}}
							onKeyDown={(event) => handleKeyDown(event, item)}
							tabIndex={isActive ? 0 : -1}
							type="button"
						>
							{marker === "bracket" ? (
								<>
									<span className={styles.bracket} aria-hidden="true">
										[
									</span>
									<span>{item.label}</span>
									<span className={styles.bracket} aria-hidden="true">
										]
									</span>
								</>
							) : (
								item.label
							)}
						</button>
					</Fragment>
				);
			})}
		</div>
	);
}

function focusTabButton(trigger: HTMLButtonElement, value: string) {
	const tablist = trigger.closest('[role="tablist"]');
	const buttons = tablist?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
	const nextButton = Array.from(buttons ?? []).find(
		(button) => button.dataset.tabValue === value,
	);
	nextButton?.focus();
}
