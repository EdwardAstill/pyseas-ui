import type { CSSProperties } from 'react';
export interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    style?: CSSProperties;
}
export declare function Checkbox({ checked, onChange, label, disabled, indeterminate, style, }: CheckboxProps): import("react/jsx-runtime").JSX.Element;
