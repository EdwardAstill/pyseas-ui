import type { CSSProperties } from 'react';
export interface NumberFieldProps {
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    error?: boolean;
    label?: string;
    hint?: string;
    style?: CSSProperties;
}
export declare function NumberField({ value, onChange, placeholder, min, max, step, disabled, readOnly, error, label, hint, style, }: NumberFieldProps): import("react/jsx-runtime").JSX.Element;
