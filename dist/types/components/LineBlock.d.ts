import type { CSSProperties, ReactNode } from "react";
interface LineBlockProps {
    text: string;
    showLineNumbers: boolean;
    maxHeight?: number | undefined;
    badge?: ReactNode | undefined;
    style?: CSSProperties | undefined;
}
export declare function LineBlock({ text, showLineNumbers, maxHeight, badge, style, }: LineBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
