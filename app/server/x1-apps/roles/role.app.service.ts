import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { RoleRepository } from "./role.repository";
import {
  ROLE_ADD_FIELDS,
  ROLE_DETAILS_X_TABLES,
  ROLE_TABLE_ACTION_CONFIG,
  ROLES_COLUMNS_CONFIG,
  ROLES_TABLE_CONFIG,
} from "./role.settings";
import { handleDbError } from "~/server/frame-work/forms-service";
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
import { parseIds, requireApp } from "./role.utils";
import { RolePermissionService } from "./role.permission.service";

const ROLE_URL_COLS = {
  APP_TYPE: "ROLE",
  ID_COL: "r_id",
  ACTION: "SAVE_ROLE",
  CANCEL_ACTION: "GET_ROLES",
  TABLE: "roles",
  HEADER: "Role",
};

export class RoleAppService extends FrameWorkAppService {
  private readonly roles_repo = new RoleRepository();

  async RoleList() {
    const sqlQuery = this.query({ r: TABLE_NAMES.ROLES })
      .select(
        "r.r_id",
        "r.r_name",
        this.query.raw(
          `CASE WHEN r.r_status = 1 THEN 'Active' ELSE 'Inactive' END as r_status`,
        ),
        "r.r_created_time",
        "r.r_last_updated",
      )
      .orderBy("r.r_id", "desc");

    return this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.ROLES,
      columns: ROLES_COLUMNS_CONFIG,
      configOverrides: ROLES_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: ROLE_TABLE_ACTION_CONFIG.heading,
      row_actions: ROLE_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddRole(
    del = false,
    extraInitialValues: Record<string, any> = {},
  ): Promise<BuildFormResult> {
    const params = this.getQueryParams();
    const selectedApps = parseIds(extraInitialValues.apps ?? params?.apps);
    const selectedModules = parseIds(
      extraInitialValues.modules ?? params?.modules,
    );
    const selectedRunTypes = parseIds(
      extraInitialValues.run_types ?? params?.run_types,
    ).map(String);

    const [appOptions, moduleOptions, runTypeOptions] = await Promise.all([
      this.getAppOptions(),
      selectedApps.length
        ? this.roles_repo.getModulesByApps(selectedApps)
        : Promise.resolve([]),
      selectedModules.length && selectedApps.length
        ? this.roles_repo.getRunTypesByModules(selectedModules)
        : Promise.resolve([]),
    ]);

    return this.BuildForm({
      fields: ROLE_ADD_FIELDS(
        appOptions,
        moduleOptions,
        runTypeOptions,
        selectedApps,
        selectedModules,
        selectedRunTypes,
      ),
      initialValues: { status: 1, ...extraInitialValues },
      url_cols: ROLE_URL_COLS,
      del,
    });
  }

  async EditRole(): Promise<BuildFormResult> {
    const roleId = this.getQueryRecordId("r_id");
    const params = this.getQueryParams();

    if (roleId && !params?.apps) {
      return this.AddRole(
        false,
        await this.loadPermissionValues(roleId, params),
      );
    }
    return this.AddRole();
  }

  async RoleDelete(): Promise<BuildFormResult> {
    const roleId = this.getQueryRecordId("r_id");
    const params = this.getQueryParams();

    if (roleId && !params?.apps) {
      return this.AddRole(
        true,
        await this.loadPermissionValues(roleId, params),
      );
    }
    return this.AddRole(true);
  }

  async RoleSave(): Promise<SaveFormResult> {
    const data = this.getFormData();
    const roleId = Number(data?.r_id ?? 0);
    const isEdit = roleId > 0;

    const roleName = String(data?.name ?? "").trim();
    if (!roleName) return { success: false, message: "Role Name is required" };

    const roleStatus = data?.status == 1 || data?.status === true ? 1 : 0;
    const selectedApps = parseIds(data?.apps);
    const selectedModules = parseIds(data?.modules);
    const selectedRunTypes = parseIds(data?.run_types);

    const appError = requireApp(selectedApps);
    if (appError) return appError;

    try {
      const resolvedRoleId = isEdit
        ? (await this.roles_repo.updateRole(roleId, {
            r_name: roleName,
            r_status: roleStatus,
          }),
          roleId)
        : await this.roles_repo.createRole({
            r_name: roleName,
            r_status: roleStatus,
          });

      const runTypeIdsToSave = await this.getValidRunTypeIds(
        selectedApps,
        selectedModules,
        selectedRunTypes,
      );

      if (!runTypeIdsToSave.length) {
        return {
          success: false,
          message: "No run types found",
        };
      }

      await this.roles_repo.saveRolePermissions(
        resolvedRoleId,
        runTypeIdsToSave,
      );
      return { success: true };
    } catch (err) {
      return handleDbError(err);
    }
  }

  async RoleDetailsX(): Promise<RenderResult> {
    const roleId = this.getQueryRecordId("r_id");
    if (!roleId) throw new Error("Role ID required");

    const [role, permissions] = await Promise.all([
      this.roles_repo.getRoleById(roleId),
      this.roles_repo.getRolePermissionXDetails(roleId),
    ]);

    if (!role) throw new Error("Role not found");

    return this.BuildDetails({
      title: `Role Details - ${role.r_name}`,
      data: { r_id: role.r_id, r_name: role.r_name, permissions },
      fields: {},
      tables: ROLE_DETAILS_X_TABLES,
    });
  }

  private async getAppOptions() {
    const apps = await this.roles_repo.getAllActiveApps();
    return apps.map((a) => ({
      value: a.app_id,
      label: `${a.app_name} (${a.app_shortcut})`,
    }));
  }

  private async loadPermissionValues(roleId: number, params: any) {
    const { initialValues } = await new RolePermissionService(
      this.roles_repo,
    ).buildPermissionXData({ roleId, queryParams: params });
    return {
      apps: initialValues.apps,
      modules: initialValues.modules,
      run_types: initialValues.run_types,
    };
  }

  private async getValidRunTypeIds(
    appIds: number[],
    moduleIds: number[],
    runTypeIds: number[],
  ): Promise<number[]> {
    // Phase 1
    if (!moduleIds.length) {
      const modules = await this.roles_repo.getModulesByApps(appIds);
      const allModuleIds = modules.map((m) => m.value);
      if (!allModuleIds.length) return [];
      const runTypes = await this.roles_repo.getRunTypesByModules(allModuleIds);
      return runTypes.map((r) => Number(r.value));
    }

    // Phase 2
    if (!runTypeIds.length) {
      const runTypes = await this.roles_repo.getRunTypesByModules(moduleIds);
      return runTypes.map((r) => Number(r.value));
    }

    // Phase 3
    return this.roles_repo.validateRunTypesForHierarchy(
      appIds,
      moduleIds,
      runTypeIds,
    );
  }

}
