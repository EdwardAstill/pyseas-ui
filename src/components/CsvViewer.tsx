import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import styles from "./Viewers.module.css";
import { cx } from "./cx";

export interface CsvData {
	headers: string[];
	rows: string[][];
}

export interface CsvViewerProps {
	/** Parsed CSV data. Pass `{ headers: [], rows: [] }` for empty state. */
	data: CsvData;
	/** Rows per page. Default: 50. */
	rowsPerPage?: number;
	/** Show filter input. Default: true. */
	filter?: boolean;
	/** Height in pixels. Omit for auto-height. */
	height?: number;
	/** Text shown when the CSV has no rows. */
	emptyMessage?: string;
	/** CSS overrides on the root element. */
	style?: CSSProperties;
}

type SortDir = "asc" | "desc";

function isNumeric(values: string[]): boolean {
	if (values.length === 0) return false;
	return values.every((v) => v !== "" && !isNaN(Number(v)));
}

function sortRows(
	rows: string[][],
	col: number | undefined,
	dir: SortDir | undefined,
): string[][] {
	if (col === undefined || dir === undefined) return rows;
	const columnValues = rows.map((r) => r[col] ?? "");
	const numeric = isNumeric(columnValues);
	return [...rows].sort((a, b) => {
		const av = numeric ? Number(a[col] ?? "") : (a[col] ?? "");
		const bv = numeric ? Number(b[col] ?? "") : (b[col] ?? "");
		let cmp: number;
		if (typeof av === "number" && typeof bv === "number") {
			cmp = av - bv;
		} else {
			cmp = String(av).localeCompare(String(bv));
		}
		return dir === "asc" ? cmp : -cmp;
	});
}

function filterRows(rows: string[][], query: string): string[][] {
	if (!query) return rows;
	const q = query.toLowerCase();
	return rows.filter((r) => r.some((cell) => cell.toLowerCase().includes(q)));
}

export function CsvViewer({
	data,
	rowsPerPage = 50,
	filter = true,
	height,
	emptyMessage = "No data",
	style,
}: CsvViewerProps) {
	const [sortCol, setSortCol] = useState<number | undefined>(undefined);
	const [sortDir, setSortDir] = useState<SortDir | undefined>(undefined);
	const [filterQuery, setFilterQuery] = useState("");
	const [page, setPage] = useState(0);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);
	const [liveQuery, setLiveQuery] = useState("");

	useEffect(() => {
		return () => clearTimeout(debounceRef.current);
	}, []);

	const handleFilterChange = useCallback((value: string) => {
		setLiveQuery(value);
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setFilterQuery(value);
			setPage(0);
		}, 200);
	}, []);

	const handleHeaderClick = useCallback((col: number) => {
		setSortCol((prev) => {
			if (prev === col) {
				setSortDir((d) => {
					if (d === "asc") return "desc";
					if (d === "desc") return undefined;
					return "asc";
				});
				return col;
			}
			setSortDir("asc");
			return col;
		});
		setPage(0);
	}, []);

	const filtered = useMemo(
		() => filterRows(data.rows, filterQuery),
		[data.rows, filterQuery],
	);

	const sorted = useMemo(
		() => sortRows(filtered, sortCol, sortDir),
		[filtered, sortCol, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const safePage = Math.min(page, totalPages - 1);

	const pageRows = useMemo(
		() => sorted.slice(safePage * rowsPerPage, (safePage + 1) * rowsPerPage),
		[sorted, safePage, rowsPerPage],
	);

	const goPage = useCallback(
		(dir: -1 | 1) =>
			setPage((p) => Math.max(0, Math.min(totalPages - 1, p + dir))),
		[totalPages],
	);

	if (data.headers.length === 0 && data.rows.length === 0) {
		return (
			<div className={styles.container} style={style}>
				<div className={styles.empty}>{emptyMessage}</div>
			</div>
		);
	}

	return (
		<div className={styles.container} style={{ height, ...style }}>
			{filter && (
				<div className={styles.toolbar}>
					<input
						className={styles.filter}
						type="text"
						placeholder="Filter rows…"
						aria-label="Filter rows"
						value={liveQuery}
						onChange={(e) => handleFilterChange(e.target.value)}
					/>
				</div>
			)}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							{data.headers.map((h, i) => {
								let arrow = "↕";
								if (i === sortCol) {
									arrow =
										sortDir === "asc" ? "↑" : sortDir === "desc" ? "↓" : "↕";
								}
								const active = i === sortCol && sortDir !== undefined;
								return (
									<th key={i} onClick={() => handleHeaderClick(i)}>
										{h}
										<span
											className={cx(
												styles.sortArrow,
												active && styles.sortArrowActive,
											)}
										>
											{arrow}
										</span>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{pageRows.map((row, ri) => (
							<tr key={safePage * rowsPerPage + ri}>
								{row.map((cell, ci) => (
									<td key={ci}>{cell}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{totalPages > 1 && (
				<div className={styles.pagination}>
					<span className={styles.pageInfo}>
						{safePage + 1} / {totalPages} ({sorted.length} rows)
					</span>
					<button
						className={styles.pageBtn}
						disabled={safePage === 0}
						onClick={() => goPage(-1)}
						type="button"
					>
						‹
					</button>
					<button
						className={styles.pageBtn}
						disabled={safePage >= totalPages - 1}
						onClick={() => goPage(1)}
						type="button"
					>
						›
					</button>
				</div>
			)}
		</div>
	);
}
