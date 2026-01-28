
export const COLORS_TABLE_CONFIG = {
    features: {
        search: {
            placeholder: "Search Vehicle colors...",
        },
    },
};

export const COLORS_COLUMNS_CONFIG = [
    { key: "id", label: "Id", type: "number" },
    { key: "color", label: "Color", type: "string" },
    { key: "ctime", label: "Create", type: "Date" },
    { key: "mtime", label: "Update", type: "Date" },
];

/*-------------------------------------------------------------*/

export const BODY_TYPE_TABLE_CONFIG = {
    features: {
        search: {
            placeholder: "Search Vehicle Body types...",
        },
    },
};

export const BODY_TYPE_COLUMNS_CONFIG = [
    { key: "id", label: "Id", type: "number" },
    { key: "body_type", label: "Body", type: "string" },
    { key: "ctime", label: "Create", type: "Date" },
    { key: "mtime", label: "Update", type: "Date" },
];

/*-------------------------------------------------------------*/

export const YEAR_TABLE_CONFIG = {
    features: {
        search: {
            placeholder: "Search vehicle Years...",
        },
    },
};

export const YEAR_COLUMNS_CONFIG = [
    { key: "id", label: "Id", type: "number" },
    { key: "year", label: "Year", type: "number" },
    { key: "ctime", label: "Create", type: "Date" },
    { key: "mtime", label: "Update", type: "string" },
];


