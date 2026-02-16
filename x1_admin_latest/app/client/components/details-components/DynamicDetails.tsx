import React, { useCallback, useMemo } from "react";
import { DataTable } from "@codeJ09/design-system/data-table";
import { useSearchParams, useNavigate } from "react-router";
import type {
  DetailsPayload,
  DetailTable,
  TableAction,
  DetailField,
} from "~/types/admin-details.types";

type Props = { payload: DetailsPayload };
export function DynamicDetails({ payload }: Props) {
  const { title, data, fields = [], tables = [], tabs = [] } = payload;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasTabs = tabs.length > 0;
  //activetab
  const tabIds = useMemo(() => tabs.map((t) => t.id), [tabs]);
  const activeTab = useMemo(() => {
    const paramTab = searchParams.get("tab");
    return paramTab && tabIds.includes(paramTab) ? paramTab : tabs[0]?.id;
  }, [searchParams, tabIds, tabs]);

  // formatingvalues
  const formatValue = useCallback(
    (value: unknown, render?: DetailField["render"]) => {
      if (value === null || value === undefined || value === "") return "—";

      switch (render) {
        case "status":
          return value === false || value === 0 ? "Active" : "Inactive";
        case "boolean":
          return value ? "Yes" : "No";
        case "date":
          return new Date(String(value)).toLocaleDateString();
        case "currency":
          return `$${Number(value).toLocaleString()}`;
        default:
          return String(value);
      }
    },
    [],
  );
  // action rendering
  const renderActions = useCallback(
    (actions: TableAction[]) =>
      ({ row }: { row: { original: Record<string, any> } }) => {
        const rowData = row.original;

        return (
          <div className="flex gap-2">
            {actions.map((action, idx) => {
              const params = new URLSearchParams();

              if (action.params) {
                (Object.entries(action.params) as [string, string][]).forEach(
                  ([queryKey, dataKey]) => {
                    const value = rowData[dataKey];
                    if (value !== undefined && value !== null) {
                      params.set(queryKey, String(value));
                    }
                  },
                );
              }

              const url = `/${action.route_prefix}/${action.appType}/${action.runType}?${params.toString()}`;

              const baseStyle =
                "px-3 py-1 text-xs rounded-lg transition shadow";

              const variantStyle =
                action.variant === "danger"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : action.variant === "secondary"
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700";

              return (
                <button
                  key={idx}
                  onClick={() => navigate(url)}
                  className={`${baseStyle} ${variantStyle}`}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        );
      },
    [navigate],
  );

  //TABLE BUILDER (AUTO-HIDE EMPTY COLUMNS)
  const buildTable = useCallback(
    (table: DetailTable) => {
      const tableData = Array.isArray(data[table.dataKey])
        ? (data[table.dataKey] as Record<string, any>[])
        : [];

      const visibleColumns = table.columns.filter((col) =>
        tableData.some((row) => {
          const value = row[col.key];
          return value !== null && value !== undefined && value !== "";
        }),
      );

      const builtColumns = visibleColumns.map((col) => ({
        id: col.key,
        accessorKey: col.key,
        header: col.label,
      }));

      if (table.actions?.length) {
        builtColumns.push({
          id: "actions",
          header: "Actions",
          cell: renderActions(table.actions),
        } as any);
      }

      return {
        tableData,
        builtColumns,
      };
    },
    [data, renderActions],
  );

  //field rendering
  const renderFields = (fieldList: DetailField[]) => (
    <div className="grid gap-4 grid-cols-3">
      {fieldList.map((field) => {
        const formatted = formatValue(data[field.key], field.render);

        const highlightColor =
          field.highlight && formatted === "Active"
            ? "text-green-600"
            : field.highlight
              ? "text-red-600"
              : "text-gray-900";

        return (
          <div key={field.key} className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs uppercase text-gray-500">{field.label}</p>
            <p className={`mt-1 text-sm font-semibold ${highlightColor}`}>
              {formatted}
            </p>
          </div>
        );
      })}
    </div>
  );

  // table rendering
  const renderTabContent = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return null;

    if (tab.type === "fields") {
      return renderFields(tab.content?.fields || fields);
    }
    if (tab.type === "table") {
      const table = tables.find((t) => t.dataKey === tab.content?.tableKey);
      if (!table) return <p>No data available</p>;

      const { tableData, builtColumns } = buildTable(table);
      if (!tableData.length) return <p>No data available</p>;

      const columnKey = builtColumns.find(
        (col) => col.id !== "actions",
      )?.accessorKey;

      if (!columnKey) return <p>No data available</p>;

      // Split values into 3 columns
      const columnsCount = 3;
      const perColumn = Math.ceil(tableData.length / columnsCount);
      const splitData = [];

      for (let i = 0; i < columnsCount; i++) {
        splitData.push(tableData.slice(i * perColumn, (i + 1) * perColumn));
      }

      return (
        <div className="grid grid-cols-3 gap-6">
          {splitData.map((colValues, colIdx) => (
            <div key={colIdx}>
              <p className="text-l uppercase text-gray-900 font-semibold mb-3">
                {builtColumns[0].header}
              </p>
              <div className="space-y-2">
                {colValues.map((row, rowIdx) => (
                  <p key={rowIdx} className="text-sm text-gray-900">
                    {formatValue(row[columnKey])}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (tab.type === "html") {
      const htmlContent = String(data[tab.content?.htmlKey || ""] || "");
      return (
        <p className="whitespace-pre-wrap">{htmlContent || "No description"}</p>
      );
    }

    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      {/* Tabs */}
      {hasTabs && (
        <div className="border-b">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("tab", tab.id);
                    return params;
                  });
                }}
                className={`pb-3 font-medium ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white  p-6">
        {hasTabs ? (
          renderTabContent()
        ) : (
          <>
            {renderFields(fields)}

            {tables.map((table, idx) => {
              const { tableData, builtColumns } = buildTable(table);

              return (
                <div key={idx} className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4">{table.title}</h2>

                  <DataTable data={tableData} columns={builtColumns} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
