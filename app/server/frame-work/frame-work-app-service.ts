import { UIComponentType } from "~/shared/admin.enums";
import type { DeepPartial, RenderResult, } from "~/types/listining-types";
import { ShellEngine } from "./shell-engine-service";
import { DEFAULT_TABLE_CONFIG, type ClarifyDataTableParams } from "./default-table-config";
import { ObjectdeepMerge } from "~/shared/util-helper";
import type { FormFields } from "~/types/form.types";
import type { BuildFormInput, BuildFormResult, SaveFormResult } from "~/types/form-builder.types";
import { requestStore } from "~/database/request-store";
import { assertDeleteAllowed, buildTitle, deleteById, getRecordId, handleDbError, prepareDbPayload, resolveFormMode } from "./forms-service";

export abstract class FrameWorkAppService extends ShellEngine {
    protected async BuildClarifyDataTable<TData extends Record<string, any>>(params: ClarifyDataTableParams): Promise<RenderResult> {

        const { component_type, sqlQuery, table_unique_id, columns, configOverrides = {}, table_header, row_actions = [], } = params;
        const data = await this.executeQuery<TData>(sqlQuery);

        return {
            component_type: UIComponentType.TABLE,
            payload: {
                table_unique_id,
                table_header,
                data,
                columns,
                row_actions,
                config: this.mergeTableConfig(configOverrides),
            },
        };
    }

    private mergeTableConfig(overrides: DeepPartial<typeof DEFAULT_TABLE_CONFIG> = {}): typeof DEFAULT_TABLE_CONFIG {
        return ObjectdeepMerge(DEFAULT_TABLE_CONFIG, overrides);
    }

    protected async BuildForm({
        fields,
        url_cols,
        del = false,
    }: BuildFormInput): Promise<BuildFormResult> {
        const params = requestStore.tryGet()?.query ?? {};
        const recordId = getRecordId(params, url_cols.ID_COL);

        assertDeleteAllowed(del, recordId, url_cols.ID_COL);

        const mode = resolveFormMode(del, recordId);
        const title = buildTitle(mode, url_cols.HEADER);

        const initialValues = recordId
            ? await this.loadInitialValues(
                recordId,
                url_cols.TABLE,
                url_cols.ID_COL,
                fields,
            )
            : {};

        return {
            component_type: UIComponentType.FORMS,
            payload: {
                title,
                fields,
                initialValues,
                app_type: url_cols.APP_TYPE,
                save_action: url_cols.ACTION,
                cancel_action: url_cols.CANCEL_ACTION,
                idColumn: url_cols.ID_COL,
                mode,
            },
        };
    }

    protected async SaveFormData(
        table: string,
        fields: FormFields,
        idColumn: string,
    ): Promise<SaveFormResult> {
        const formData = requestStore.tryGet()?.formData ?? {};
        const recordId = getRecordId(formData, idColumn);
        const isDelete = deleteById(formData);

        const payload = prepareDbPayload(fields, idColumn, formData);

        try {
            if (isDelete) {
                await this.query(table).where(idColumn, recordId).del();
            } else if (recordId) {
                await this.query(table).where(idColumn, recordId).update(payload);
            } else {
                await this.query(table).insert(payload);
            }

            return { success: true };
        } catch (err) {
            console.log("err---", err);

            return handleDbError(err, fields);
        }
    }

    private async loadInitialValues(
        recordId: number,
        table: string,
        idColumn: string,
        fields: FormFields,
    ): Promise<Record<string, unknown>> {
        const row = await this.query(table)
            .where(idColumn, recordId)
            .first<Record<string, unknown>>();

        if (!row) return {};

        const values: Record<string, unknown> = {};

        for (const [key, def] of Object.entries(fields)) {
            if (!def.db) continue;
            values[key] = row[def.db] ?? "";
        }

        return values;
    }

}
