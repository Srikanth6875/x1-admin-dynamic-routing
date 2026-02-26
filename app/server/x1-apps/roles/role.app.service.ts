import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { RoleRepository } from "./role.repository";
import {
  ROLE_DETAILS_TABLES,
  ROLE_FIELDS,
  ROLE_PERMISSION_FIELDS,
  ROLE_TABLE_ACTION_CONFIG,
  ROLES_COLUMNS_CONFIG,
  ROLES_TABLE_CONFIG,
} from "./role.settings";
import { requestStore } from "~/database/request-store";
import { getRecordId, handleDbError } from "~/server/frame-work/forms-service";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import type { RenderResult } from "~/types/listining-types";

export class RoleAppService extends FrameWorkAppService {
  private readonly roles_repo = new RoleRepository();

  async RoleList() {
    const sqlQuery = this.query({ r: TABLE_NAMES.ROLES })
      .select(
        "r.r_id",
        "r.r_name",
        "r.r_label",
        this.query.raw(`
          CASE WHEN r.r_status = 1 THEN 'Active' ELSE 'Inactive' END as r_status
        `),
        "r.r_created_time",
        "r.r_last_updated",
      )
      .orderBy("r.r_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROLES,
      columns: ROLES_COLUMNS_CONFIG,
      configOverrides: ROLES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: ROLE_TABLE_ACTION_CONFIG.heading,
      row_actions: ROLE_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddRole(del: boolean = false): Promise<BuildFormResult> {
    return this.BuildForm({
      fields: ROLE_FIELDS(),
      url_cols: {
        APP_TYPE: "ROLE",
        ID_COL: "r_id",
        ACTION: "SAVE_ROLE",
        CANCEL_ACTION: "GET_ROLES",
        TABLE: "roles",
        HEADER: "Role",
      },
      del,
    });
  }

  async EditRole(): Promise<BuildFormResult> {
    return this.AddRole();
  }

  async RoleSave(): Promise<SaveFormResult> {
    return this.SaveFormData("roles", ROLE_FIELDS(), "r_id");
  }

  async RoleDelete(): Promise<BuildFormResult> {
    return this.AddRole(true);
  }

  protected async RolePermission(): Promise<BuildFormResult> {
    const params = requestStore.tryGet()?.query ?? {};
    const roleId = getRecordId(params, "r_id");

    if (!roleId) throw new Error("Role ID required");

    const role = await this.roles_repo.getRoleById(roleId);
    if (!role) throw new Error("Role not found");

    const assigned = await this.roles_repo.getAssignedPermissions(roleId);
    let selectedAppTypes = this.parseAppTypes(params.app_types);

    if (selectedAppTypes.length === 0) {
      selectedAppTypes = [...new Set(assigned.map((p) => p.rp_app_type_id))];
    }

    const selectedRunTypes = assigned
      .filter((p) => selectedAppTypes.includes(p.rp_app_type_id))
      .map((p) => p.rp_app_run_type_id);

    const [appTypes, runTypes] = await Promise.all([
      this.roles_repo.getAllAppTypes(),
      this.roles_repo.getRunTypesForAppTypes(selectedAppTypes),
    ]);

    return this.BuildForm({
      fields: ROLE_PERMISSION_FIELDS(
        appTypes,
        runTypes,
        selectedAppTypes,
        selectedRunTypes,
      ),
      initialValues: {
        r_id: role.r_id,
        role_name: role.r_name,
        app_types: selectedAppTypes,
        run_types: selectedRunTypes,
      },
      url_cols: {
        APP_TYPE: "ROLE",
        ID_COL: "r_id",
        ACTION: "SAVE_ROLE_PERMISSION",
        CANCEL_ACTION: "GET_ROLES",
        TABLE: "roles",
        HEADER: "Role",
      },
    });
  }

  protected async SaveRolePermission(): Promise<SaveFormResult> {
    const data = (requestStore.tryGet()?.formData ?? {}) as any;
    const roleId = Number(data?.r_id);

    if (!roleId) return { success: false, message: "Invalid role ID" };

    const appTypeIds = this.parseIds(data?.app_types);
    const runTypeIds = this.parseIds(data?.run_types);

    try {
      const validRunTypes = await this.roles_repo.validateRunTypes(
        runTypeIds,
        appTypeIds,
      );

      if (validRunTypes.length !== runTypeIds.length) {
        return { success: false, message: "Invalid run types selected." };
      }

      await this.roles_repo.replaceRolePermissions(roleId, validRunTypes);
      return { success: true };
    } catch (err) {
      return handleDbError(err);
    }
  }

  protected parseAppTypes(raw: unknown): number[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(Number).filter((v) => !isNaN(v));
    return String(raw)
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));
  }

  protected parseIds(raw: unknown): number[] {
    if (!raw) return [];
    if (Array.isArray(raw))
      return (raw as any[]).map(Number).filter((v) => !isNaN(v));
    return String(raw)
      .split(",")
      .map(Number)
      .filter((v) => !isNaN(v));
  }

  async RoleDetails(): Promise<RenderResult> {
    const params = requestStore.tryGet()?.query ?? {};
    const roleId = getRecordId(params, "r_id");
    if (!roleId) throw new Error("Role ID required");

    const [role, permissions] = await Promise.all([
      this.roles_repo.getRoleById(roleId),
      this.roles_repo.getRolePermissionsForDetails(roleId),
    ]);

    if (!role) throw new Error("Role not found");

    return this.BuildDetails({
      title: `Role Details — ${role.r_name}`,
      data: {
        r_id: role.r_id,
        r_name: role.r_name,
        permissions,
      },
      fields: {},
      tables: ROLE_DETAILS_TABLES,
    });
  }
  
}
