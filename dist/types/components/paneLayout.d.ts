export type DropEdge = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type SplitDirection = 'row' | 'col';
export interface LeafNode<TTab extends string = string> {
    type: 'leaf';
    id: string;
    tabs: TTab[];
    activeTab: TTab;
}
export interface SplitNode<TTab extends string = string> {
    type: 'split';
    dir: SplitDirection;
    children: LayoutNode<TTab>[];
    sizes?: number[];
}
export type LayoutNode<TTab extends string = string> = LeafNode<TTab> | SplitNode<TTab>;
export interface LeafSearchResult<TTab extends string = string> {
    leaf: LeafNode<TTab>;
    path: number[];
}
export interface LayoutRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface LayoutPoint {
    x: number;
    y: number;
}
export interface MoveTabOptions<TTab extends string = string> {
    tab: TTab;
    sourceLeafId: string;
    targetLeafId: string;
    edge: DropEdge;
    newLeafId?: string;
}
export interface MoveGroupOptions {
    sourceLeafId: string;
    targetLeafId: string;
    edge: DropEdge;
    newLeafId?: string;
}
export declare function cloneLayout<TTab extends string>(node: LayoutNode<TTab>): LayoutNode<TTab>;
export declare function normalizeSplitSizes(sizes: number[] | undefined, count: number): number[];
export declare function findLeafById<TTab extends string>(node: LayoutNode<TTab>, leafId: string, path?: number[]): LeafSearchResult<TTab> | null;
export declare function findLeafOfTab<TTab extends string>(node: LayoutNode<TTab>, tab: TTab, path?: number[]): LeafSearchResult<TTab> | null;
export declare function setActiveTab<TTab extends string>(node: LayoutNode<TTab>, leafId: string, tab: TTab): LayoutNode<TTab>;
export declare function setSplitSizesAtPath<TTab extends string>(node: LayoutNode<TTab>, path: number[], sizes: number[]): LayoutNode<TTab>;
export declare function removeLeafById<TTab extends string>(node: LayoutNode<TTab>, leafId: string): LayoutNode<TTab> | null;
export declare function insertLeafAt<TTab extends string>(node: LayoutNode<TTab>, targetLeafId: string, leaf: LeafNode<TTab>, edge: DropEdge): LayoutNode<TTab>;
export declare function insertTabAt<TTab extends string>(node: LayoutNode<TTab>, targetLeafId: string, tab: TTab, edge: DropEdge, newLeafId?: string): LayoutNode<TTab>;
export declare function moveTab<TTab extends string>(node: LayoutNode<TTab>, options: MoveTabOptions<TTab>): LayoutNode<TTab>;
export declare function moveGroup<TTab extends string>(node: LayoutNode<TTab>, options: MoveGroupOptions): LayoutNode<TTab>;
export declare function computeDropEdge(point: LayoutPoint, rect: LayoutRect, threshold?: number): DropEdge;
