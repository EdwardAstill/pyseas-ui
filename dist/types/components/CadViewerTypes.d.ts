import type { CSSProperties, ReactNode } from "react";
export type CadViewerStatus = "idle" | "loading" | "error" | "ready";
export type CadViewerTheme = "dark" | "light";
export type CadStepSurfaceMode = "flat" | "shaded";
export type CadStepEdgeMode = "none" | "visible" | "hidden" | "wire";
export interface CadViewerDownload {
    href: string;
    filename?: string;
    label?: string;
}
export interface BaseCadViewerProps {
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
export interface CadDxfViewerProps extends BaseCadViewerProps {
    fileUrl?: string | null;
    clearColor?: number | undefined;
    theme?: CadViewerTheme | undefined;
}
export interface CadStepViewerProps extends BaseCadViewerProps {
    meshUrl?: string | null;
    theme?: CadViewerTheme | undefined;
    /** Initial surface style. Default: flat colour with no lighting/shading. */
    surfaceMode?: CadStepSurfaceMode | undefined;
    /** Initial edge style. Default: no edge overlay. */
    edgeMode?: CadStepEdgeMode | undefined;
    /** Enable OrbitControls damping/inertia. Default: false for immediate CAD-style response. */
    dampedControls?: boolean | undefined;
}
