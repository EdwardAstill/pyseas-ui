import type { CSSProperties } from "react";
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
export declare function SegmentedGroup({ options, value, onChange, disabled, size, className, style, }: SegmentedGroupProps): import("react/jsx-runtime").JSX.Element;
