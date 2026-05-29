import {
	useCallback,
	useState,
	type CSSProperties,
	type ReactNode,
} from "react";
import styles from "./TreeNav.module.css";
import { cx } from "./cx";

export interface TreeNavNode {
	id: string;
	label: string;
	href?: string;
	icon?: ReactNode;
	children?: TreeNavNode[];
	active?: boolean;
	disabled?: boolean;
}

export interface TreeNavProps {
	nodes: TreeNavNode[];
	onNodeClick?: (node: TreeNavNode) => void;
	expandedIds?: Set<string>;
	onToggle?: (id: string) => void;
	className?: string;
	style?: CSSProperties;
}

export function TreeNav({
	nodes,
	onNodeClick,
	expandedIds: controlledExpanded,
	onToggle,
	className,
	style,
}: TreeNavProps) {
	const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
		() => new Set(),
	);

	const isControlled = controlledExpanded !== undefined;
	const expanded = isControlled ? controlledExpanded : internalExpanded;

	const toggle = useCallback(
		(id: string) => {
			if (isControlled) {
				onToggle?.(id);
			} else {
				setInternalExpanded((prev) => {
					const next = new Set(prev);
					if (next.has(id)) {
						next.delete(id);
					} else {
						next.add(id);
					}
					return next;
				});
			}
		},
		[isControlled, onToggle],
	);

	return (
		<nav className={cx(styles.tree, className)} style={style}>
			{nodes.map((node) => (
				<TreeNavBranch
					key={node.id}
					node={node}
					depth={0}
					expanded={expanded}
					onToggle={toggle}
					onNodeClick={onNodeClick}
				/>
			))}
		</nav>
	);
}

interface TreeNavBranchProps {
	node: TreeNavNode;
	depth: number;
	expanded: Set<string>;
	onToggle: (id: string) => void;
	onNodeClick: ((node: TreeNavNode) => void) | undefined;
}

function TreeNavBranch({
	node,
	depth,
	expanded,
	onToggle,
	onNodeClick,
}: TreeNavBranchProps) {
	const hasChildren = (node.children?.length ?? 0) > 0;
	const isExpanded = hasChildren && expanded.has(node.id);

	const content = (
		<>
			{hasChildren && (
				<button
					type="button"
					className={styles.disclosure}
					onClick={(e) => {
						e.stopPropagation();
						onToggle(node.id);
					}}
					aria-label={isExpanded ? "Collapse" : "Expand"}
					aria-expanded={isExpanded}
					tabIndex={-1}
				>
					<span
						className={cx(styles.chevron, isExpanded && styles.chevronOpen)}
						aria-hidden="true"
					>
						▸
					</span>
				</button>
			)}
			{!hasChildren && <span className={styles.spacer} aria-hidden="true" />}
			{node.icon !== undefined && (
				<span className={styles.nodeIcon} aria-hidden="true">
					{node.icon}
				</span>
			)}
			{node.href !== undefined ? (
				<a
					href={node.href}
					className={styles.link}
					onClick={(e) => {
						if (node.disabled) {
							e.preventDefault();
							return;
						}
						onNodeClick?.(node);
					}}
				>
					{node.label}
				</a>
			) : (
				<button
					type="button"
					className={styles.label}
					disabled={node.disabled}
					onClick={() => onNodeClick?.(node)}
				>
					{node.label}
				</button>
			)}
		</>
	);

	return (
		<div className={styles.branch}>
			<div
				className={cx(
					styles.row,
					node.active && styles.rowActive,
					node.disabled && styles.rowDisabled,
				)}
				style={{ paddingLeft: `calc(var(--ps-space-md) + ${depth * 16}px)` }}
				role="treeitem"
				aria-expanded={hasChildren ? isExpanded : undefined}
				aria-selected={node.active}
				aria-disabled={node.disabled}
			>
				{content}
			</div>
			{hasChildren && isExpanded && (
				<div role="group">
					{node.children!.map((child) => (
						<TreeNavBranch
							key={child.id}
							node={child}
							depth={depth + 1}
							expanded={expanded}
							onToggle={onToggle}
							onNodeClick={onNodeClick}
						/>
					))}
				</div>
			)}
		</div>
	);
}
