import type React from "react";
import { Link } from "react-router";
import { SquarePen, Trash2, Eye, UserCog } from "lucide-react";
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
    case "view":
      return <Eye size={18} strokeWidth={1.8} />;
    case "outline":
      return <UserCog size={18} strokeWidth={1.8} />;
    case "secondary":
    default:
      return <SquarePen size={18} strokeWidth={1.8} />;
  }
};

const VARIANT_STYLES: Record<string, string> = {
  danger: "text-red-500 hover:text-red-600",
  view: "text-blue-500 hover:text-blue-600",
  secondary: "text-green-500 hover:text-green-600",
  outline: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50",
};

export const TableColumnActions = <TData extends Record<string, any>>({
  actions,
  row,
}: TableColumnActionsProps<TData>) => {
  if (!actions.length) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const baseStyle =
          "flex items-center justify-center p-1 transition-colors duration-200";

        const variantStyle =
          VARIANT_STYLES[action.btn_variant ?? "secondary"] ??
          VARIANT_STYLES.secondary;

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
