import type { CSSProperties, ReactNode } from 'react';
export interface FieldRootProps {
    label?: string | undefined;
    hint?: string | undefined;
    children: ReactNode;
    style?: CSSProperties | undefined;
}
export declare function FieldRoot({ label, hint, children, style }: FieldRootProps): import("react/jsx-runtime").JSX.Element;
