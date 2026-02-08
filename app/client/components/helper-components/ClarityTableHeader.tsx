import { Link } from "react-router";
import { buildActionLink, getActionBtnClasses } from "../core-components/action-helper";
import type { ClarityTableHeaderProps } from "~/shared/listining-types";

export const ClarityTableHeader: React.FC<ClarityTableHeaderProps> = ({ tableHeader, }) => {
    if (!tableHeader) return null;
    const { title, actions = [] } = tableHeader;
    if (!title && actions.length === 0) return null;

    return (
        <div className="flex items-center justify-between rounded-md bg-gray-50 border border-gray-200 px-2 py-1.5">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

            <nav className="hidden md:flex gap-2 flex-row-reverse">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={buildActionLink(action)}
                        className={`px-1.5 py-1 rounded-md text-sm font-medium border transition whitespace-nowrap ${getActionBtnClasses(action.btn_variant)}`}
                    >
                        {action.btn_label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};
