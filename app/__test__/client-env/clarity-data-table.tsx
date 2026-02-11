import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ClarityDataTable } from "~/client/components/core-components/clarity-data-table";
import type { TablePayload } from "~/shared/listining-types";

// Mock DataTable
jest.mock("@codeJ09/design-system/data-table", () => ({
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
  table_unique_id: "generic_table",
  columns: [{ key: "name", label: "Name", type: "string" }],
  data: [{ name: "Item A" }, { name: "Item B" }],
  config: {
    features: {
      pagination: {
        pageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
      },
    },
  },
  table_header: {
    title: "Records",
    actions: [],
  },
};

const renderTable = (payload: Partial<TablePayload> = {}) =>
  render(
    <MemoryRouter>
      <ClarityDataTable payload={{ ...basePayload, ...payload }} />
    </MemoryRouter>
  );

describe("ClarityDataTable", () => {
  test("renders table header title when provided", () => {
    renderTable();
    expect(screen.getByText("Records")).toBeInTheDocument();
  });

  test("does not render header when title is empty and no actions", () => {
    renderTable({
      table_header: { title: "", actions: [] },
    });

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  test("renders header action buttons with correct labels", () => {
    renderTable({
      table_header: {
        title: "Records",
        actions: [
          {
            btn_label: "Add Item",
            btn_variant: "primary",
            appType: "SYSTEM_A",
            runType: "CREATE",
          },
        ],
      },
    });

    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  test("builds link without query params correctly", () => {
    renderTable({
      table_header: {
        title: "Records",
        actions: [
          {
            btn_label: "Open",
            btn_variant: "secondary",
            appType: "SYSTEM_B",
            runType: "VIEW",
          },
        ],
      },
    });

    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("href", "/list/SYSTEM_B/VIEW");
  });

  test("builds link WITH query params correctly", () => {
    renderTable({
      table_header: {
        title: "Records",
        actions: [
          {
            btn_label: "Filtered",
            btn_variant: "secondary",
            appType: "SYSTEM_C",
            runType: "LIST",
            params: { status: "active", sort: "asc" },
          },
        ],
      },
    });

    const link = screen.getByRole("link", { name: "Filtered" });
    const href = link.getAttribute("href") || "";

    expect(href).toContain("/list/SYSTEM_C/LIST?");
    expect(href).toContain("status=active");
    expect(href).toContain("sort=asc");
  });

  test("applies correct button variant styles", () => {
    renderTable({
      table_header: {
        title: "Records",
        actions: [
          { btn_label: "Primary", btn_variant: "primary", appType: "X", runType: "A" },
          { btn_label: "Secondary", btn_variant: "secondary", appType: "X", runType: "B" },
          { btn_label: "Danger", btn_variant: "danger", appType: "X", runType: "C" },
          { btn_label: "Default", appType: "X", runType: "D" },
        ],
      },
    });

    expect(screen.getByText("Primary").className).toMatch(/bg-\[#0074cc\]/);
    expect(screen.getByText("Secondary").className).toMatch(/bg-\[#5bb75b\]/);
    expect(screen.getByText("Danger").className).toMatch(/bg-\[#da4f49\]/);
    expect(screen.getByText("Default").className).toMatch(/bg-\[#0074cc\]/);
  });

  test("passes correct props to DataTable", () => {
    renderTable();

    expect(screen.getByTestId("table-id")).toHaveTextContent("generic_table");
    expect(screen.getByTestId("row-count")).toHaveTextContent("2");
    expect(screen.getByTestId("column-count")).toHaveTextContent("1");
    expect(screen.getByTestId("config-present")).toHaveTextContent("yes");
  });
});
