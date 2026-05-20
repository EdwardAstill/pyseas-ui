import type { CSSProperties } from 'react';
export interface ToggleProps {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
    disabled?: boolean;
    size?: 'sm' | 'md';
    style?: CSSProperties;
}
export declare function Toggle({ value, onChange, label, disabled, size, style }: ToggleProps): import("react/jsx-runtime").JSX.Element;
