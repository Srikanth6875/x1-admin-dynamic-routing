import type { DataTableConfig } from "@codeJ09/design-system";
import { apiClient } from "~/shared/api-client";
import type { EditPayload } from "./inline-table-types";

type EditorConfig = NonNullable<DataTableConfig<unknown>["features"]>["editing"];
type OnUpdateHandler = NonNullable<Exclude<EditorConfig, boolean>>["onUpdate"];

export const editOnUpdateAdapter = (handler: (payload: EditPayload) => Promise<void>): OnUpdateHandler =>
  async (params) => {
    await handler({
      row: {
        index: params.row.index,
        original: params.row.original as Record<string, any>,
      },
      tableId: params.tableId,
      columnId: params.columnId,
      oldValue: params.oldValue,
      newValue: params.newValue,
    });
  };

export const handleCellUpdate = async (payload: EditPayload): Promise<void> => {
  try {
    await apiClient.post("/actions/inline-edit", payload);
  } catch (error) {
    throw new Error("Inline edit failed");
  }
};