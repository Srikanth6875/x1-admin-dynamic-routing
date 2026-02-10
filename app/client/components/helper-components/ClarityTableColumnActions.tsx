import type React from "react";
import { Link } from "react-router";
import { buildActionLinkwithid, getActionBtnClasses } from "../core-components/action-helper";
import type { TableActionBtn } from "~/shared/listining-types";
type TableColumnActionsProps<TData> = {
  actions: TableActionBtn[];
  row: TData;
};

export const TableColumnActions = <TData extends Record<string, any>>({ actions, row, }: TableColumnActionsProps<TData>) => {
  if (!actions.length) return null;

  return (
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={buildActionLinkwithid(action, row)}
          className={`px-1.5 py-1 rounded-md text-sm font-medium border transition whitespace-nowrap ${getActionBtnClasses(
            action.btn_variant
          )}`}
        >
          {action.btn_label}
        </Link>
      ))}
    </div>
  );
};
