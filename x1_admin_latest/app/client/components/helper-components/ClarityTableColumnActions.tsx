import type React from "react";
import { Link } from "react-router";
import { SquarePen, Trash2 } from "lucide-react";
import type { TableActionBtn } from "~/types/listining-types";

type TableColumnActionsProps<TData> = {
  actions: TableActionBtn[];
  row: TData;
};

export function buildActionLinkwithid<TData extends Record<string, any>>(
  action: TableActionBtn,
  row: TData,
): string {
  const basePath = `/${action.route_prefix ?? "list"}/${action.appType}/${action.runType}`;

  if (!action.params) return basePath;

  const resolvedParams = Object.fromEntries(
    Object.entries(action.params).map(([key, value]) => [
      key,
      row[value as keyof TData] ?? value,
    ]),
  );

  return `${basePath}?${new URLSearchParams(resolvedParams).toString()}`;
}

const ActionIcon = ({ variant }: { variant?: string }) => {
  switch (variant) {
    case "danger":
      return <Trash2 size={18} strokeWidth={1.8} />;
    case "secondary":
    default:
      return <SquarePen size={18} strokeWidth={1.8} />;
  }
};

/* ---------- Component ---------- */

export const TableColumnActions = <TData extends Record<string, any>>({
  actions,
  row,
}: TableColumnActionsProps<TData>) => {
  if (!actions.length) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const isDanger = action.btn_variant === "danger";
        const baseStyle =
          "flex h-7 w-7 items-center justify-center rounded-xl border transition-all duration-200";
        const variantStyle = isDanger
          ? "border-red-400/50 text-red-500 hover:border-red-500 hover:text-red-600 hover:shadow-[0_0_0_3px_rgba(239,68,68,0.25)]"
          : "border-green-400/50 text-green-500 hover:border-green-500 hover:text-green-600 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.25)]";

        return (
          <Link
            key={index}
            to={buildActionLinkwithid(action, row)}
            title={action.btn_label}
            className={`${baseStyle} ${variantStyle}`}
          >
            <ActionIcon variant={action.btn_variant} />
          </Link>
        );
      })}
    </div>
  );
};
