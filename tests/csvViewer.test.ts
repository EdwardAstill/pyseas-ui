import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { CsvViewer, type CsvData } from "../src/components/CsvViewer";

function simpleData(): CsvData {
	return {
		headers: ["Name", "Value", "Unit"],
		rows: [
			["Alpha", "10", "mm"],
			["Beta", "25", "mm"],
			["Gamma", "5", "mm"],
		],
	};
}

describe("CsvViewer", () => {
	test("renders header row", () => {
		render(createElement(CsvViewer, { data: simpleData() }));
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Value")).toBeDefined();
		expect(screen.getByText("Unit")).toBeDefined();
	});

	test("renders data rows", () => {
		render(createElement(CsvViewer, { data: simpleData() }));
		expect(screen.getByText("Alpha")).toBeDefined();
		expect(screen.getByText("10")).toBeDefined();
	});

	test("renders empty state when no data", () => {
		render(createElement(CsvViewer, { data: { headers: [], rows: [] } }));
		expect(screen.getByText("No data")).toBeDefined();
	});

	test("renders custom empty message", () => {
		render(
			createElement(CsvViewer, {
				data: { headers: [], rows: [] },
				emptyMessage: "Nothing here",
			}),
		);
		expect(screen.getByText("Nothing here")).toBeDefined();
	});

	test("hides filter when filter=false", () => {
		render(createElement(CsvViewer, { data: simpleData(), filter: false }));
		expect(screen.queryByPlaceholderText("Filter rows…")).toBeNull();
	});

	test("shows filter by default", () => {
		render(createElement(CsvViewer, { data: simpleData() }));
		expect(screen.getByPlaceholderText("Filter rows…")).toBeDefined();
	});

	test("shows pagination for large datasets", () => {
		const rows = Array.from({ length: 60 }, (_, i) => [
			`Item ${i}`,
			String(i * 10),
			"mm",
		]);
		render(
			createElement(CsvViewer, {
				data: { headers: ["Name", "Value", "Unit"], rows },
				rowsPerPage: 50,
			}),
		);
		expect(screen.getByText(/60 rows/)).toBeDefined();
	});
});
