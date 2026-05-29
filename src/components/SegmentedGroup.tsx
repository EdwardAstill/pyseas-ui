import type { CSSProperties, KeyboardEvent } from "react";
import styles from "./SegmentedGroup.module.css";
import { cx } from "./cx";

export interface SegmentedGroupOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SegmentedGroupProps {
	options: SegmentedGroupOption[];
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	size?: "sm" | "md";
	className?: string;
	style?: CSSProperties;
}

export function SegmentedGroup({
	options,
	value,
	onChange,
	disabled = false,
	size = "md",
	className,
	style,
}: SegmentedGroupProps) {
	function handleKeyDown(
		e: KeyboardEvent<HTMLButtonElement>,
		currentValue: string,
	) {
		if (disabled) return;
		const enabled = options.filter((o) => o.disabled !== true);
		if (enabled.length === 0) return;
		const idx = enabled.findIndex((o) => o.value === currentValue);
		if (idx === -1) return;

		let nextIdx = idx;
		switch (e.key) {
			case "ArrowRight":
			case "ArrowDown":
				e.preventDefault();
				nextIdx = (idx + 1) % enabled.length;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				e.preventDefault();
				nextIdx = (idx - 1 + enabled.length) % enabled.length;
				break;
			case "Home":
				e.preventDefault();
				nextIdx = 0;
				break;
			case "End":
				e.preventDefault();
				nextIdx = enabled.length - 1;
				break;
			default:
				return;
		}
		onChange(enabled[nextIdx]!.value);
	}

	const sizeCls = size === "sm" ? styles.groupSm : styles.groupMd;

	return (
		<div
			className={cx(
				styles.group,
				sizeCls,
				disabled && styles.groupDisabled,
				className,
			)}
			role="radiogroup"
			style={style}
		>
			{options.map((opt, index) => {
				const isActive = opt.value === value;
				const isDisabled = opt.disabled === true || disabled;
				const position: "first" | "last" | "middle" =
					index === 0
						? "first"
						: index === options.length - 1
							? "last"
							: "middle";
				const positionCls =
					position === "first"
						? styles.optionFirst
						: position === "last"
							? styles.optionLast
							: styles.optionMiddle;

				return (
					<button
						key={opt.value}
						type="button"
						role="radio"
						aria-checked={isActive}
						disabled={isDisabled}
						aria-disabled={isDisabled}
						className={cx(
							styles.option,
							positionCls,
							isActive && styles.optionActive,
							isDisabled && styles.optionDisabled,
						)}
						tabIndex={isActive ? 0 : -1}
						onClick={() => {
							if (!isDisabled && !isActive) onChange(opt.value);
						}}
						onKeyDown={(e) => handleKeyDown(e, opt.value)}
					>
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}
