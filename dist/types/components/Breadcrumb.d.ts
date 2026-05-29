import { type CSSProperties } from "react";
export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
}
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: "/" | "›" | ">" | string;
    maxItems?: number;
    className?: string;
    style?: CSSProperties;
}
export declare function Breadcrumb({ items, separator, maxItems, className, style, }: BreadcrumbProps): import("react/jsx-runtime").JSX.Element;
