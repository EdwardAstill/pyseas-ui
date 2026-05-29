import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { type ButtonVariant, type ButtonSize } from './buttonClasses';
export type { ButtonVariant, ButtonSize };
export interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    icon?: ReactNode;
    children?: ReactNode;
    title?: string;
    autoFocus?: boolean;
    style?: CSSProperties;
}
export declare function Button({ variant, size, disabled, loading, type, onClick, icon, children, title, autoFocus, style, }: ButtonProps): import("react/jsx-runtime").JSX.Element;
