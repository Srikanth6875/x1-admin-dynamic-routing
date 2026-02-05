import { DataTable } from "@codeJ09/data-table";
import { Link } from "react-router";
import { TablePayload } from "~/clarity-admin/frame-work-types";

type TableComponentProps = {
  payload: TablePayload;
};

export const ClarityDataTable: React.FC<TableComponentProps> = ({ payload }) => {
  const { table_header, data, table_unique_id, columns, config, header_actions = [] } = payload;

  const buildLink = (action: (typeof header_actions)[number]) => {
    const basePath = `/list/${action.appType}/${action.runType}`;
    if (!action.params) return basePath;

    const searchParams = new URLSearchParams(action.params).toString();
    return `${basePath}?${searchParams}`;
  };

  return (
    <section className="space-y-2">
      {(table_header || header_actions.length > 0) && (
        <div className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 px-3 py-2">
          <h1 className="text-lg font-semibold text-gray-900">{table_header}</h1>

          {/* Right → Left Button Layout */}
          <nav className="hidden md:flex gap-2 flex-row-reverse">
            {header_actions.map((action, index) => (
              <Link
                key={index}
                to={buildLink(action)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition whitespace-nowrap
                  ${action.btn_variant === "primary"
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : action.btn_variant === "danger"
                      ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {action.btn_label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <DataTable
        tableId={table_unique_id}
        data={{
          data,
          columns,
        }}
        config={config}
      />
    </section>
  );
};

