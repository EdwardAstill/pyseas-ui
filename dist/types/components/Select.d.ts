import type { CSSProperties } from 'react';
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
    style?: CSSProperties;
}
export declare function Select({ options, value, onChange, placeholder, disabled, error, label, style, }: SelectProps): import("react/jsx-runtime").JSX.Element;
