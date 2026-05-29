import type { CSSProperties } from "react";
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
export declare function TextField({ value, onChange, placeholder, disabled, readOnly, error, label, hint, name, id, autoFocus, style, }: TextFieldProps): import("react/jsx-runtime").JSX.Element;
