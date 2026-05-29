import type { CSSProperties } from "react";
import styles from "./fields.module.css";
import { cx } from "./cx";
import { FieldRoot } from "./FieldRoot";

export interface TextFieldProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	error?: boolean;
	label?: string;
	hint?: string;
	name?: string;
	id?: string;
	autoFocus?: boolean;
	style?: CSSProperties;
}

export function TextField({
	value,
	onChange,
	placeholder,
	disabled,
	readOnly,
	error,
	label,
	hint,
	name,
	id,
	autoFocus,
	style,
}: TextFieldProps) {
	const hintId =
		hint !== undefined && id !== undefined ? `${id}-hint` : undefined;
	const inputCls = cx(styles.input, error && styles.inputError);

	return (
		<FieldRoot
			label={label}
			hint={hint}
			inputId={id}
			hintId={hintId}
			style={style}
		>
			<input
				id={id}
				className={inputCls}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				readOnly={readOnly}
				name={name}
				autoFocus={autoFocus}
				aria-invalid={error === true}
				aria-describedby={hintId}
			/>
		</FieldRoot>
	);
}
