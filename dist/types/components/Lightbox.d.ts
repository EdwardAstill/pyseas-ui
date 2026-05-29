import { type CSSProperties } from "react";
export interface LightboxProps {
    open: boolean;
    onClose: () => void;
    src: string;
    alt?: string;
    className?: string;
    style?: CSSProperties;
}
export declare function Lightbox({ open, onClose, src, alt, className, style, }: LightboxProps): import("react").ReactPortal | null;
