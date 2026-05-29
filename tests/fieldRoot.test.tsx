import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { NumberField, Select, TextField } from "../src/index";

describe("field controls", () => {
	test("associates TextField label and hint with the input", () => {
		render(
			<TextField
				id="name"
				label="Name"
				hint="Required"
				value=""
				onChange={() => undefined}
			/>,
		);

		const input = screen.getByLabelText("Name");
		expect(input.getAttribute("aria-describedby")).toBeTruthy();
		expect(
			document.getElementById(input.getAttribute("aria-describedby") ?? "")
				?.textContent,
		).toBe("Required");
	});

	test("associates NumberField and Select labels with their controls", () => {
		render(
			<>
				<NumberField label="Load" value={12} onChange={() => undefined} />
				<Select
					label="Mode"
					value="a"
					onChange={() => undefined}
					options={[{ value: "a", label: "A" }]}
				/>
			</>,
		);

		expect(screen.getByLabelText("Load").getAttribute("role")).toBe(
			"spinbutton",
		);
		expect(screen.getByLabelText("Mode").tagName).toBe("SELECT");
	});
});
