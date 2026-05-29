import { useId, type CSSProperties } from "react";
import styles from "./Slider.module.css";
import { cx } from "./cx";

export interface SliderProps {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	label?: string;
	disabled?: boolean;
	size?: "sm" | "md";
	className?: string;
	style?: CSSProperties;
}

export function Slider({
	value,
	onChange,
	min,
	max,
	step,
	label,
	disabled = false,
	size = "md",
	className,
	style,
}: SliderProps) {
	const id = useId();
	const pct = ((value - min) / (max - min)) * 100;
	const sizeCls = size === "sm" ? styles.sliderSm : styles.sliderMd;

	return (
		<div
			className={cx(
				styles.sliderRoot,
				sizeCls,
				disabled && styles.sliderDisabled,
				className,
			)}
			style={style}
		>
			{label !== undefined && (
				<label htmlFor={id} className={styles.label}>
					{label}
				</label>
			)}
			<div className={styles.trackWrapper}>
				<div className={styles.track}>
					<div
						className={styles.fill}
						style={{ width: `${pct}%` }}
						aria-hidden="true"
					/>
				</div>
				<input
					id={id}
					type="range"
					className={styles.input}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					min={min}
					max={max}
					step={step}
					disabled={disabled}
					aria-label={label}
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={value}
				/>
			</div>
		</div>
	);
}
