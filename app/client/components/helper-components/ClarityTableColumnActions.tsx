import type React from "react";
import { Link } from "react-router";
import { buildActionLink, getActionBtnClasses } from "../core-components/action-helper";
import type { TableActionBtn } from "~/shared/listining-types";
type TableColumnActionsProps = {
  actions: TableActionBtn[];
};

export const TableColumnActions: React.FC<TableColumnActionsProps> = ({ actions }) => {
  if (actions.length === 0) return null;
  return (
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={buildActionLink(action)}
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
