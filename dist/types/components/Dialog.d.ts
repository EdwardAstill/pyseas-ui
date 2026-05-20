import { type ReactNode } from 'react';
export type DialogSize = 'sm' | 'md' | 'lg';
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    titleActions?: ReactNode;
    footer?: ReactNode;
    size?: DialogSize;
    children: ReactNode;
    className?: string;
}
export declare function Dialog({ open, onClose, title, titleActions, footer, size, children, className, }: DialogProps): import("react").ReactPortal | null;
