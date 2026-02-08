import type { ColumnMetadata, DataTableConfig } from "@codeJ09/design-system";
import type { Knex } from "knex";
import type { UIComponentType } from "~/shared/admin.enums";
import type { DeepPartial, TableActionBtn } from "~/shared/listining-types";

export type ClarifyDataTableParams = {
  component_type: UIComponentType;
  query: Knex.QueryBuilder | Knex.Raw;
  table_unique_id: string;
  columns: ColumnMetadata[];
  configOverrides?: DeepPartial<typeof DEFAULT_TABLE_CONFIG>;
  table_header?: {
    title: string;
    actions?: TableActionBtn[];
  };
  row_actions?: TableActionBtn[];
};

export const DEFAULT_TABLE_CONFIG: DataTableConfig = {
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
    views: {
      enabled: false,
      initialViews: undefined,
      activeViewId: undefined,
    },
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
    editing: {
      enabled: true,
      autoSaveOnBlur: false,
      highlightEdited: true,
      autoSaveDelay: 0,
    },
  },
  layout: {
    density: "comfortable",
    striped: true,
    hoverable: true,
  },
};


