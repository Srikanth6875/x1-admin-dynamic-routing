import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ClarityDataTable } from "./clarity-data-table";
import type { TablePayload } from "~/clarity-admin/frame-work-types";

//Mock DataTable so we can inspect props
jest.mock("@codeJ09/data-table", () => ({
    DataTable: ({ tableId, data, config }: any) => (
        <div data-testid="data-table">
            <span data-testid="table-id">{tableId}</span>
            <span data-testid="row-count">{data.data.length}</span>
            <span data-testid="column-count">{data.columns.length}</span>
            <span data-testid="config-present">{config ? "yes" : "no"}</span>
        </div>
    ),
}));

const basePayload: TablePayload = {
    table_header: "Rooftop Records",
    table_unique_id: "rooftop_table",
    columns: [{ key: "name", label: "Name", type: "string" }],
    data: [{ name: "Building A" }, { name: "Building B" }],
    config: { pagination: true },
    header_actions: [],
};

const renderTable = (payload: Partial<TablePayload> = {}) =>
    render(
        <MemoryRouter>
            <ClarityDataTable payload={{ ...basePayload, ...payload }} />
        </MemoryRouter>
    );

describe("ClarityDataTable", () => {
    test("renders table header when provided", () => {
        renderTable();
        expect(screen.getByText("Rooftop Records")).toBeInTheDocument();
    });

    test("does not render header section if no header and no actions", () => {
        renderTable({ table_header: "", header_actions: [] });
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    test("renders header action buttons with correct labels", () => {
        renderTable({
            header_actions: [
                {
                    btn_label: "Add Rooftop",
                    btn_variant: "primary",
                    appType: "rooftops",
                    runType: "create",
                },
            ],
        });

        expect(screen.getByText("Add Rooftop")).toBeInTheDocument();
    });

    test("builds link without params correctly", () => {
        renderTable({
            header_actions: [
                {
                    btn_label: "Open",
                    btn_variant: "secondary",
                    appType: "rooftops",
                    runType: "view",
                },
            ],
        });

        const link = screen.getByRole("link", { name: "Open" });
        expect(link).toHaveAttribute("href", "/list/rooftops/view");
    });

    test("builds link WITH query params correctly", () => {
        renderTable({
            header_actions: [
                {
                    btn_label: "Filtered",
                    btn_variant: "secondary",
                    appType: "rooftops",
                    runType: "list",
                    params: { status: "active", sort: "asc" },
                },
            ],
        });

        const link = screen.getByRole("link", { name: "Filtered" });
        expect(link.getAttribute("href")).toContain("/list/rooftops/list?");
        expect(link.getAttribute("href")).toContain("status=active");
        expect(link.getAttribute("href")).toContain("sort=asc");
    });

    test("applies correct button variant styles", () => {
        renderTable({
            header_actions: [
                { btn_label: "Primary", btn_variant: "primary", appType: "a", runType: "b" },
                { btn_label: "Danger", btn_variant: "danger", appType: "a", runType: "b" },
                { btn_label: "Default", btn_variant: "secondary", appType: "a", runType: "b" },
            ],
        });

        expect(screen.getByText("Primary").className).toMatch(/bg-blue-600/);
        expect(screen.getByText("Danger").className).toMatch(/bg-red-600/);
        expect(screen.getByText("Default").className).toMatch(/bg-white/);
    });

    test("passes correct props to DataTable", () => {
        renderTable();

        expect(screen.getByTestId("table-id")).toHaveTextContent("rooftop_table");
        expect(screen.getByTestId("row-count")).toHaveTextContent("2");
        expect(screen.getByTestId("column-count")).toHaveTextContent("1");
        expect(screen.getByTestId("config-present")).toHaveTextContent("yes");
    });
});
