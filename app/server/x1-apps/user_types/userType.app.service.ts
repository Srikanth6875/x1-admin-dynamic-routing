import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import {
  USER_TYPE_FIELDS,
  USER_TYPE_DB_FIELDS,
  USER_TYPES_COLUMNS_CONFIG,
  USER_TYPES_TABLE_CONFIG,
  USER_TYPES_TABLE_ACTION_CONFIG,
} from "./user-types-settings";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";
import { UserTypeRepository } from "./user-type.repository";

export class UserTypeAppService extends FrameWorkAppService {
  private readonly db = new UserTypeRepository();

  async UserTypeList() {
    const sqlQuery = this.query({ ut: TABLE_NAMES.USER_TYPES })
      .leftJoin({ utr: "user_type_role_map" }, "ut.ut_id", "utr.utr_ut_id")
      .leftJoin({ r: "roles" }, "utr.utr_r_id", "r.r_id")
      .select(
        "ut.ut_id",
        "ut.ut_name",
        this.query.raw(
          `CASE WHEN ut.ut_status = 1 THEN 'Active' ELSE 'Inactive' END as ut_status`,
        ),
        this.query.raw(
          `COALESCE(STRING_AGG(r.r_name, ', '), 'No Roles') as roles`,
        ),
        "ut.ut_created_time",
        "ut.ut_last_updated",
      )
      .groupBy(
        "ut.ut_id",
        "ut.ut_name",
        "ut.ut_status",
        "ut.ut_created_time",
        "ut.ut_last_updated",
      )
      .orderBy("ut.ut_id", "desc");

    return this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.USER_TYPES,
      columns: USER_TYPES_COLUMNS_CONFIG,
      configOverrides: USER_TYPES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: USER_TYPES_TABLE_ACTION_CONFIG.heading,
      row_actions: USER_TYPES_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddUserType(del = false): Promise<BuildFormResult> {
    const utId = this.getQueryRecordId("ut_id");
    const roles = await this.db.getActiveRoles();

    const selectedRoles = utId
      ? (await this.db.getAssignedRoles(utId)).map((r) => r.utr_r_id)
      : [];

    const fields = USER_TYPE_FIELDS(roles, selectedRoles);

    return this.BuildForm({
      fields,
      url_cols: {
        APP_TYPE: "USER_TYPE",
        ID_COL: "ut_id",
        ACTION: "SAVE_USER_TYPE",
        CANCEL_ACTION: "GET_USER_TYPES",
        TABLE: "user_types",
        HEADER: "User Type",
      },

      initialValues: {
        ut_status: 1,
        roles: selectedRoles,
      },

      del,
    });
  }

  async UserTypeEdit(): Promise<BuildFormResult> {
    return this.AddUserType();
  }

  async UserTypeDelete(): Promise<BuildFormResult> {
    const form = await this.AddUserType(true);

    const status = form.payload.initialValues.ut_status;
    form.payload.initialValues.ut_status = status === 1 ? "Active" : "Inactive";

    return form;
  }

  async UserTypeSave(): Promise<SaveFormResult> {
    const result = await this.SaveFormData(
      "user_types",
      USER_TYPE_DB_FIELDS(),
      "ut_id",
    );

    const data = this.getFormData();
    const isDelete = data._delete;

    if (!isDelete) {
      const utId = Number(this.getFormRecordId("ut_id")) || result.record_id;

      const roleIds = this.parseRoles(data.roles);

      if (utId) {
        await this.db.replaceUserTypeRoles(utId, roleIds);
      }
    }

    return result;
  }

  private parseRoles(raw: unknown): number[] {
    if (!raw) return [];

    if (Array.isArray(raw)) return raw.map(Number).filter((n) => !isNaN(n));

    return String(raw)
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
  }
}
