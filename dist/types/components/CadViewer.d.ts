import type { CSSProperties, ReactNode } from 'react';
export type CadViewerStatus = 'idle' | 'loading' | 'error' | 'ready';
export interface CadViewerDownload {
    href: string;
    filename?: string;
    label?: string;
}
interface BaseCadViewerProps {
    status?: CadViewerStatus;
    error?: string | null;
    emptyMessage?: string;
    loadingMessage?: string;
    title?: ReactNode;
    metadata?: ReactNode;
    download?: CadViewerDownload | null;
    className?: string | undefined;
    style?: CSSProperties | undefined;
}
export type CadViewerTheme = 'dark' | 'light';
export interface CadDxfViewerProps extends BaseCadViewerProps {
    fileUrl?: string | null;
    clearColor?: number | undefined;
    theme?: CadViewerTheme | undefined;
}
export interface CadStepViewerProps extends BaseCadViewerProps {
    meshUrl?: string | null;
    theme?: CadViewerTheme | undefined;
}
export declare function CadDxfViewer({ fileUrl, status, error, emptyMessage, loadingMessage, title, metadata, download, clearColor, theme, className, style, }: CadDxfViewerProps): import("react/jsx-runtime").JSX.Element;
export declare function CadStepViewer({ meshUrl, status, error, emptyMessage, loadingMessage, title, metadata, download, theme, className, style, }: CadStepViewerProps): import("react/jsx-runtime").JSX.Element;
export {};
