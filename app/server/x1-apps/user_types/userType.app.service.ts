import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";

import {
  USER_TYPE_FIELDS,
  USER_TYPES_COLUMNS_CONFIG,
  USER_TYPES_TABLE_CONFIG,
  USER_TYPES_TABLE_ACTION_CONFIG,
  USER_TYPE_ROLE_MAP_FIELDS,
} from "./user-types-settings";

import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";
import { UserTypeRepository } from "./user-type.repository";
import { requestStore } from "~/database/request-store";
import { getRecordId, handleDbError } from "~/server/frame-work/forms-service";

export class UserTypeAppService extends FrameWorkAppService {
  private readonly db = new UserTypeRepository();

  async UserTypeList() {
    const sqlQuery = this.query({ ut: TABLE_NAMES.USER_TYPES })
      .leftJoin({ utr: "user_type_role_map" }, "ut.ut_id", "utr.utr_ut_id")
      .leftJoin({ r: "roles" }, "utr.utr_r_id", "r.r_id")
      .select(
        "ut.ut_id",
        "ut.ut_name",
        "ut.ut_label",
        this.query.raw(`
        CASE WHEN ut.ut_status = 1 THEN 'Active' ELSE 'Inactive' END as ut_status
      `),
        this.query.raw(`
        COALESCE(STRING_AGG(r.r_name, ', '), 'No Roles') as roles
      `),
        "ut.ut_created_time",
        "ut.ut_last_updated",
      )
      .groupBy(
        "ut.ut_id",
        "ut.ut_name",
        "ut.ut_label",
        "ut.ut_status",
        "ut.ut_created_time",
        "ut.ut_last_updated",
      )
      .orderBy("ut.ut_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.USER_TYPES,
      columns: USER_TYPES_COLUMNS_CONFIG,
      configOverrides: USER_TYPES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: USER_TYPES_TABLE_ACTION_CONFIG.heading,
      row_actions: USER_TYPES_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddUserType(del: boolean = false): Promise<BuildFormResult> {
    const fields = USER_TYPE_FIELDS();

    const url_cols = {
      APP_TYPE: "USER_TYPE",
      ID_COL: "ut_id",
      ACTION: "SAVE_USER_TYPE",
      CANCEL_ACTION: "GET_USER_TYPES",
      TABLE: "user_types",
      HEADER: "User Type",
    };

    return this.BuildForm({
      fields,
      url_cols,
      del,
    });
  }

  async UserTypeEdit(): Promise<BuildFormResult> {
    return this.AddUserType();
  }

  async UserTypeSave(): Promise<SaveFormResult> {
    const fields = USER_TYPE_FIELDS();
    return this.SaveFormData("user_types", fields, "ut_id");
  }

  async UserTypeDelete(): Promise<BuildFormResult> {
    return this.AddUserType(true);
  }

  protected async UserTypeRoleMap(): Promise<BuildFormResult> {
    const params = requestStore.tryGet()?.query ?? {};
    const utId = getRecordId(params, "ut_id");

    if (!utId) throw new Error("User Type ID required");

    const userType = await this.db.getUserTypeById(utId);
    const roles = await this.db.getActiveRoles();
    const assigned = await this.db.getAssignedRoles(utId);

    const selectedValues = assigned.map((r) => r.utr_r_id);
    const fields = USER_TYPE_ROLE_MAP_FIELDS(roles, selectedValues);

    if (userType) {
      fields.ut_id.default = userType.ut_id;
      fields.ut_name.default = userType.ut_name;
    }

    return this.BuildForm({
      fields,
      initialValues: {
        ut_id: userType?.ut_id ?? "",
        ut_name: userType?.ut_name ?? "",
        roles: selectedValues,
      },
      url_cols: {
        APP_TYPE: "USER_TYPE",
        ID_COL: "ut_id",
        ACTION: "SAVE_USER_TYPE_ROLE_MAP",
        CANCEL_ACTION: "GET_USER_TYPES",
        TABLE: "user_types",
        HEADER: "Role Mapping",
      },
    });
  }

  protected async SaveUserTypeRoleMap(): Promise<SaveFormResult> {
    const data = (requestStore.tryGet()?.formData ?? {}) as any;

    const utId = Number(data.ut_id);
    const roleIds = this.parseRoles(data.roles);

    try {
      await this.db.replaceUserTypeRoles(utId, roleIds);
      return { success: true };
    } catch (err) {
      return handleDbError(err);
    }
  }

  protected parseRoles(raw: unknown): number[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(Number).filter((n) => !isNaN(n));
    if (raw === "") return [];
    return String(raw)
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
  }
  
}
