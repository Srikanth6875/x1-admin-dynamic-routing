export const topNavItems = [
  { name: "rooftops", appType: "ROOFTOPS", runType: "GET_ROOFTOPS" },
  { name: "Vehicles", appType: "VEHICLES", runType: "VEHICLE_LIST" },
  { name: "Import Jobs", appType: "IMPORT_JOBS", runType: "IMPORT_JOB_LIST" },
  { name: "Import File Jobs", appType: "IMPORT_JOBS", runType: "IMPORT_FILE_JOB_LIST" },
];

export const sidebarItems = [
  // { name: "Makes", appType: "VEH_INFO", runType: "GET_MAKES" },
  // { name: "Model", appType: "VEH_INFO", runType: "MODEL_LIST" },
  // { name: "Trim", appType: "VEH_INFO", runType: "VEH_TRIMS" },
  // { name: "Years", appType: "VEH_INFO", runType: "YEAR_LIST" },
  // { name: "Body Types", appType: "VEH_INFO", runType: "BODY_TYPES" },
  // { name: "Int/Ext Colors", appType: "VEH_INFO", runType: "VEH_COLORS" },
  { name: "Makes", appType: "MAKE", runType: "GET_MAKES" },
  { name: "Model", appType: "MODEL", runType: "GET_MODELS" },
  { name: "Trim", appType: "TRIM", runType: "GET_TRIMS" },
  { name: "Int/Ext Colors", appType: "COLOUR", runType: "GET_COLOURS" },
  { name: "Years", appType: "YEAR", runType: "GET_YEARS" },
];

export const TABLE_NAMES = {
  USERS: "users",
  VEHICLES: "vehicles",
  ROOFTOP: "rooftop",
  VEHICLE_YEAR: "veh_year",
  VEHICLE_BODY_TYPE: "veh_body_type",
  VEHICLE_COLOR: "veh_color",
  VEHICLE_IMAGES: "veh_images",
  VEHICLE_MAKE: "veh_make",
  VEHICLE_MODEL: "veh_model",
  VEHICLE_TRIM: "veh_trim",
  IMPORT_JOBS: "import_jobs",
  IMPORT_FILE_JOBS: "import_file_jobs",
};

export const MONGO_COLLECTIONS = {
  VEHICLE_DESCRIPTION: "vehicle_descriptions",
  VEHICLE_OPTIONS: "vehicle_options",
};

export const CLARITY_DATA_TABLE_UNIQUE_IDS = {
  ROOFTOP: "rooftop_table",
  VEHICLES: "vehicles_table",
  IMPORT_JOBS: "import_jobs_table",
  IMPORT_FILE_JOBS: "import_file_jobs_table",
  VEHICLE_MAKES: "veh_make_table",
  VEHICLE_MODELS: "veh_make&veh_model_table",
  VEHICLE_TRIMS: "veh_make&veh_model&veh_trim_table",
  VEHICLE_YEARS: "veh_year_table",
  VEHICLE_BODY_TYPES: "veh_body_type_table",
  VEHICLE_COLORS: "veh_color_table",
}