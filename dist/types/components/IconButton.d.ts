import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { type ButtonVariant, type ButtonSize } from './buttonClasses';
export interface IconButtonProps {
    icon: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    title: string;
    type?: 'button' | 'submit' | 'reset';
    style?: CSSProperties;
}
export declare function IconButton({ icon, variant, size, disabled, loading, onClick, title, type, style, }: IconButtonProps): import("react/jsx-runtime").JSX.Element;
