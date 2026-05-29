import type { CSSProperties, ReactNode } from 'react';
export interface AppShellProps {
    topbar?: ReactNode;
    sidebar?: ReactNode;
    statusbar?: ReactNode;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}
export interface TopBarProps {
    title?: ReactNode;
    subtitle?: ReactNode;
    left?: ReactNode;
    right?: ReactNode;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}
export interface IconSidebarItem {
    id: string;
    label: string;
    icon: ReactNode;
    disabled?: boolean;
    title?: string;
}
export interface IconSidebarProps {
    items: IconSidebarItem[];
    activeItem?: string;
    onItemSelect?: (id: string) => void;
    brand?: ReactNode;
    footerItems?: IconSidebarItem[];
    className?: string;
    style?: CSSProperties;
    'aria-label'?: string;
}
export interface StatusBarProps {
    left?: ReactNode;
    right?: ReactNode;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}
export declare function AppShell({ topbar, sidebar, statusbar, children, className, style }: AppShellProps): import("react/jsx-runtime").JSX.Element;
export declare function TopBar({ title, subtitle, left, right, children, className, style, }: TopBarProps): import("react/jsx-runtime").JSX.Element;
export declare function IconSidebar({ items, activeItem, onItemSelect, brand, footerItems, className, style, 'aria-label': ariaLabel, }: IconSidebarProps): import("react/jsx-runtime").JSX.Element;
export declare function StatusBar({ left, right, children, className, style }: StatusBarProps): import("react/jsx-runtime").JSX.Element;
