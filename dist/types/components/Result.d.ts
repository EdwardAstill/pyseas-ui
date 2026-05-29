import type { CSSProperties } from 'react';
export type ResultStatus = 'ok' | 'warn' | 'err' | 'info' | 'none';
export interface ResultProps {
    label: string;
    value: string | number;
    unit?: string;
    status?: ResultStatus;
    ratio?: string;
    note?: string;
    style?: CSSProperties;
}
export declare function Result({ label, value, unit, status, ratio, note, style }: ResultProps): import("react/jsx-runtime").JSX.Element;
