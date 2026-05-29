import type { CSSProperties } from "react";
import styles from "./fields.module.css";
import { cx } from "./cx";
import { FieldRoot } from "./FieldRoot";

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps {
	options: SelectOption[];
	value: string | null;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
	label?: string;
	id?: string;
	style?: CSSProperties;
}

export function Select({
	options,
	value,
	onChange,
	placeholder,
	disabled,
	error,
	label,
	id,
	style,
}: SelectProps) {
	const selectCls = cx(styles.select, error && styles.selectError);

	return (
		<FieldRoot label={label} inputId={id} style={style}>
			<select
				id={id}
				className={selectCls}
				value={value === null ? "" : value}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				aria-invalid={error === true}
			>
				{placeholder !== undefined && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value} disabled={opt.disabled}>
						{opt.label}
					</option>
				))}
			</select>
		</FieldRoot>
	);
}
