export const DEFAULT_TABLE_CONFIG = {
  features: {
    sorting: true,
    pagination: {
      pageSize: 25,
      pageSizeOptions: [25, 50, 75, 100],
    },
    rowSelection: "multiple",
    search: {
      placeholder: "Search...",
      debounce: 200,
    },
    views: true,
    columnManager: {
      excludeColumnIds: ["select", "actions"],
      enableReordering: true,
      enableVisibilityToggle: true,
    },
    filterManager: {
      excludeColumnIds: ["select", "actions"],
      enablePresets: true,
      enableQuickFilters: true,
    },
  },
  layout: {
    density: "comfortable",
    striped: true,
    hoverable: true,
  },
};
