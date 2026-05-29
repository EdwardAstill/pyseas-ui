import type {
	TreeDisclosureArgs,
	TreeMoveArgs,
	TreeNode,
	TreeRenderArgs,
} from "../src/index";
import styles from "./App.module.css";
import { classNames } from "./catalogShared";

export type FileSystemNodeMeta =
	| { kind: "folder"; detail: string }
	| { kind: "file"; detail: string };
export type TreeVisualOption = "blocks" | "marks" | "rail";

export const treeVisualOptions: Array<{
	value: TreeVisualOption;
	label: string;
}> = [
	{ value: "blocks", label: "Blocks" },
	{ value: "marks", label: "Plus / minus" },
	{ value: "rail", label: "Rail" },
];

export const initialFileTreeNodes: TreeNode<FileSystemNodeMeta>[] = [
	{
		id: "workspace",
		label: "workspace",
		data: { kind: "folder", detail: "root" },
		children: [
			{
				id: "src",
				label: "src",
				data: { kind: "folder", detail: "folder" },
				children: [
					{
						id: "src-components",
						label: "components",
						data: { kind: "folder", detail: "folder" },
						children: [
							{
								id: "src-components-tree",
								label: "Tree.tsx",
								data: { kind: "file", detail: "tsx" },
							},
							{
								id: "src-components-tree-css",
								label: "Tree.module.css",
								data: { kind: "file", detail: "css" },
							},
							{
								id: "src-components-panel",
								label: "Panel.tsx",
								data: { kind: "file", detail: "tsx" },
							},
						],
					},
					{
						id: "src-index",
						label: "index.ts",
						data: { kind: "file", detail: "ts" },
					},
					{
						id: "src-styles",
						label: "styles.css",
						data: { kind: "file", detail: "css" },
					},
				],
			},
			{
				id: "examples",
				label: "examples",
				data: { kind: "folder", detail: "folder" },
				children: [
					{
						id: "examples-app",
						label: "App.tsx",
						data: { kind: "file", detail: "tsx" },
					},
					{
						id: "examples-data",
						label: "demoData.ts",
						data: { kind: "file", detail: "ts" },
					},
				],
			},
			{
				id: "tests",
				label: "tests",
				data: { kind: "folder", detail: "folder" },
				children: [
					{
						id: "tests-smoke",
						label: "smoke.test.ts",
						data: { kind: "file", detail: "test" },
					},
					{
						id: "tests-number",
						label: "numberField.test.ts",
						data: { kind: "file", detail: "test" },
					},
				],
			},
			{
				id: "package-json",
				label: "package.json",
				data: { kind: "file", detail: "json" },
			},
			{
				id: "readme",
				label: "README.md",
				data: { kind: "file", detail: "md" },
			},
		],
	},
];

export function renderFileTreeNode(
	{ node, selected }: TreeRenderArgs<FileSystemNodeMeta>,
	visual: TreeVisualOption,
) {
	const kind = node.data?.kind ?? "file";

	return (
		<span
			className={classNames(
				styles.fileTreeNode,
				selected && styles.fileTreeNodeSelected,
				visual === "rail" && styles.fileTreeNodeRail,
			)}
		>
			<span
				className={classNames(
					styles.fileTreeIcon,
					kind === "folder"
						? styles.fileTreeFolderIcon
						: styles.fileTreeFileIcon,
				)}
				aria-hidden="true"
			/>
			<span className={styles.fileTreeLabel}>{node.label}</span>
			<span className={styles.fileTreeDetail}>{node.data?.detail}</span>
		</span>
	);
}

export function renderFileTreeDisclosure(
	{ expanded, selected }: TreeDisclosureArgs<FileSystemNodeMeta>,
	visual: TreeVisualOption,
) {
	if (visual === "marks") {
		return (
			<span
				className={classNames(
					styles.treeDisclosure,
					styles.treeDisclosureMark,
					expanded && styles.treeDisclosureMarkExpanded,
					selected && styles.treeDisclosureSelected,
				)}
				aria-hidden="true"
			>
				{expanded ? "−" : "+"}
			</span>
		);
	}

	if (visual === "rail") {
		return (
			<span
				className={classNames(
					styles.treeDisclosure,
					styles.treeDisclosureRail,
					expanded && styles.treeDisclosureRailExpanded,
					selected && styles.treeDisclosureSelected,
				)}
				aria-hidden="true"
			/>
		);
	}

	return (
		<span
			className={classNames(
				styles.treeDisclosure,
				styles.treeDisclosureBlock,
				expanded && styles.treeDisclosureBlockExpanded,
				selected && styles.treeDisclosureSelected,
			)}
			aria-hidden="true"
		/>
	);
}

export function canDropFileTreeNode({
	position,
	targetNode,
}: TreeMoveArgs<FileSystemNodeMeta>) {
	return position !== "inside" || targetNode.data?.kind === "folder";
}

export function moveFileTreeNode(
	nodes: TreeNode<FileSystemNodeMeta>[],
	args: TreeMoveArgs<FileSystemNodeMeta>,
) {
	const { nodes: withoutDragged, removed } = removeTreeNode(
		nodes,
		args.draggedId,
	);
	if (removed === null) return nodes;

	const { nodes: nextNodes, inserted } = insertTreeNode(
		withoutDragged,
		args.targetId,
		args.position,
		removed,
	);

	return inserted ? nextNodes : nodes;
}

function removeTreeNode(
	nodes: TreeNode<FileSystemNodeMeta>[],
	id: string,
): {
	nodes: TreeNode<FileSystemNodeMeta>[];
	removed: TreeNode<FileSystemNodeMeta> | null;
} {
	let removed: TreeNode<FileSystemNodeMeta> | null = null;
	const nextNodes: TreeNode<FileSystemNodeMeta>[] = [];

	for (const node of nodes) {
		if (node.id === id) {
			removed = node;
			continue;
		}

		if (node.children === undefined) {
			nextNodes.push(node);
			continue;
		}

		const childResult = removeTreeNode(node.children, id);
		if (childResult.removed !== null) removed = childResult.removed;
		nextNodes.push({ ...node, children: childResult.nodes });
	}

	return { nodes: nextNodes, removed };
}

function insertTreeNode(
	nodes: TreeNode<FileSystemNodeMeta>[],
	targetId: string,
	position: TreeMoveArgs<FileSystemNodeMeta>["position"],
	nodeToInsert: TreeNode<FileSystemNodeMeta>,
): { nodes: TreeNode<FileSystemNodeMeta>[]; inserted: boolean } {
	let inserted = false;
	const nextNodes: TreeNode<FileSystemNodeMeta>[] = [];

	for (const node of nodes) {
		if (node.id === targetId && position === "before") {
			nextNodes.push(nodeToInsert);
			inserted = true;
		}

		if (node.id === targetId && position === "inside") {
			nextNodes.push({
				...node,
				children: [...(node.children ?? []), nodeToInsert],
			});
			inserted = true;
			continue;
		}

		if (node.children === undefined) {
			nextNodes.push(node);
		} else {
			const childResult = insertTreeNode(
				node.children,
				targetId,
				position,
				nodeToInsert,
			);
			if (childResult.inserted) inserted = true;
			nextNodes.push({ ...node, children: childResult.nodes });
		}

		if (node.id === targetId && position === "after") {
			nextNodes.push(nodeToInsert);
			inserted = true;
		}
	}

	return { nodes: nextNodes, inserted };
}
