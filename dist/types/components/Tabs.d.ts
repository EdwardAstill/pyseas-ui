export interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
}
export type TabsOrientation = "horizontal" | "vertical";
export type TabsMarker = "underline" | "bracket" | "slash";
export interface TabsProps {
    items: TabItem[];
    value: string;
    onChange: (value: string) => void;
    orientation?: TabsOrientation;
    marker?: TabsMarker;
    className?: string;
}
export declare function Tabs({ items, value, onChange, orientation, marker, className, }: TabsProps): import("react/jsx-runtime").JSX.Element;
