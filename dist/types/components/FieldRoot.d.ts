import type { CSSProperties, ReactNode } from "react";
export interface FieldRootProps {
    label?: string | undefined;
    hint?: string | undefined;
    inputId?: string | undefined;
    hintId?: string | undefined;
    children: ReactNode;
    style?: CSSProperties | undefined;
}
export declare function FieldRoot({ label, hint, inputId, hintId, children, style, }: FieldRootProps): import("react/jsx-runtime").JSX.Element;
