import { type CSSProperties, type ReactNode, type Ref, type RefObject } from "react";
import type { CadViewerDownload, CadViewerStatus, CadViewerTheme } from "./CadViewerTypes";
export declare const DARK_BG = 1710618;
export declare const LIGHT_BG = 16119285;
interface CadViewerFrameProps {
    title?: ReactNode;
    metadata?: ReactNode;
    controls?: ReactNode;
    download?: CadViewerDownload | null;
    children: ReactNode;
    className?: string | undefined;
    style?: CSSProperties | undefined;
    frameRef?: Ref<HTMLDivElement>;
    theme?: CadViewerTheme;
}
export declare function resolvedStatus(sourceUrl: string | null | undefined, status: CadViewerStatus | undefined): CadViewerStatus;
export declare function displayMessage(status: CadViewerStatus, error: string | null | undefined, emptyMessage: string, loadingMessage: string): string | null;
export declare function useCadTheme(theme: CadViewerTheme | undefined): {
    frameRef: RefObject<HTMLDivElement | null>;
    activeTheme: CadViewerTheme;
};
export declare function CadViewerFrame({ title, metadata, controls, download, children, className, style, frameRef, theme, }: CadViewerFrameProps): import("react/jsx-runtime").JSX.Element;
export declare function StateText({ message, isError, }: {
    message: string | null;
    isError?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
