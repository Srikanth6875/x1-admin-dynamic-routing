export const VEHICLE_TABLE_CONFIG = {
    features: {
        pagination: {
            pageSize: 250,
            pageSizeOptions: [250, 500, 750, 1000],
        },
        search: {
            placeholder: "Search Vehicles...",
        },
    },
};

export const VEHICLE_COLUMNS_CONFIG = [
    { key: "veh_id", label: "ID", type: "number" },
    { key: "veh_vin", label: "Vin", type: "string" },
    { key: "veh_stock", label: "Stock", type: "string" },
    { key: "veh_listing_type", label: "Type", type: "string" },
    { key: "veh_certified", label: "Cert", type: "string" },
    { key: "veh_miles", label: "Miles", type: "number" },
    { key: "veh_active", label: "Active", type: "number" },
    { key: "year", label: "Year", type: "number" },
    { key: "make", label: "Make", type: "string" },
    { key: "model", label: "Model", type: "string" },
    { key: "trim", label: "Trim", type: "string" },
    { key: "body_type", label: "Body", type: "string" },
    { key: "exterior_color", label: "Ext col", type: "string" },
    { key: "interior_color", label: "Int col", type: "string" },
    { key: "veh_ctime", label: "Create", type: "Date" },
];