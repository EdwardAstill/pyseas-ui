import type { CSSProperties, ReactNode } from 'react';
export type DrawingSource = {
    kind: 'svg';
    content: string;
    label?: string;
} | {
    kind: 'svg-url';
    url: string;
    label?: string;
} | {
    kind: 'image';
    url: string;
    label?: string;
};
export type DrawingViewerStatus = 'idle' | 'loading' | 'error' | 'ready';
export interface DrawingDownload {
    href: string;
    filename?: string;
    label?: string;
}
export interface DrawingViewerProps {
    source?: DrawingSource | null;
    status?: DrawingViewerStatus;
    error?: string | null;
    emptyMessage?: string;
    loadingMessage?: string;
    metadata?: ReactNode;
    download?: DrawingDownload | null;
    className?: string;
    style?: CSSProperties;
}
export declare function DrawingViewer({ source, status, error, emptyMessage, loadingMessage, metadata, download, className, style, }: DrawingViewerProps): import("react/jsx-runtime").JSX.Element;
