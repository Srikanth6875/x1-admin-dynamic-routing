import type { TableActionBtn } from "~/shared/listining-types";

export const buildActionLink = (action: TableActionBtn) => {
    const basePath = `/${action.route_prefix ?? "list"}/${action.appType}/${action.runType}`;
    if (!action.params) return basePath;

    const searchParams = new URLSearchParams(action.params).toString();
    return `${basePath}?${searchParams}`;
};

export const getActionBtnClasses = (variant?: TableActionBtn["btn_variant"]) => {
    switch (variant) {
        case "danger":
            return "bg-[#da4f49] text-white hover:bg-[#da4f49]";
        case "secondary":
            return "bg-[#5bb75b] text-white hover:bg-[#4fa04f]";
        case "primary":
        default:
            return "bg-[#0074cc] text-white hover:bg-[#0074cc]";
    }
};


export const buildActionLinkwithid = <TData extends Record<string, any>>(
    action: TableActionBtn,
    row: TData
) => {
    const basePath = `/${action.route_prefix ?? "list"}/${action.appType}/${action.runType}`;
    if (!action.params) return basePath;
 
    const resolvedParams = Object.fromEntries(
        Object.entries(action.params).map(([key, value]) => [
            key,
            row[value as keyof TData] ?? value,
        ])
    );
 
    return `${basePath}?${new URLSearchParams(resolvedParams).toString()}`;
};