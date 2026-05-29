import { type CSSProperties } from "react";
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
export declare function Slider({ value, onChange, min, max, step, label, disabled, size, className, style, }: SliderProps): import("react/jsx-runtime").JSX.Element;
