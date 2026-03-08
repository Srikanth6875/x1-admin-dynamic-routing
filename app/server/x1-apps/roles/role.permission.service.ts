import { ROLE_PERMISSION_X_FIELDS } from "./role.settings";
import type { RoleRepository } from "./role.repository";
import { parseIds } from "./role.utils";

export class RolePermissionService {
  constructor(private readonly roles_repo: RoleRepository) {}

  async buildPermissionXData(input: { roleId: number; queryParams: any }) {
    const { roleId, queryParams } = input;
    const role = await this._getValidRole(roleId);
    const selection = await this._resolveSelection(roleId, queryParams);

    const moduleOptions = selection.selectedApps.length
      ? await this.roles_repo.getModulesByApps(selection.selectedApps)
      : [];

    const validModuleIds = selection.selectedModules.filter((mId) =>
      moduleOptions.some((m) => Number(m.value) === Number(mId)),
    );

    const runTypeOptions = validModuleIds.length
      ? await this.roles_repo.getRunTypesByModules(validModuleIds)
      : [];

    const appOptions = await this._getAppOptions();
    const validRunTypeIds = selection.selectedRunTypeIds.map(Number);

    const fields = ROLE_PERMISSION_X_FIELDS(
      appOptions,
      moduleOptions,
      runTypeOptions,
      selection.selectedApps,
      validModuleIds,
      validRunTypeIds,
    );

    fields.role_name.default = role.r_name;
    fields.r_id.default = role.r_id;

//new 
return {
  fields,
  initialValues: {
    r_id: role.r_id,
    role_name: role.r_name,
    apps: selection.selectedApps,
    modules: validModuleIds,
    run_types: validRunTypeIds,
    assignment_level: "RUNTYPE", 
  },
};

  }

  private async _getValidRole(roleId: number) {
    const role = await this.roles_repo.getRoleById(roleId);
    if (!role) throw new Error("Role not found");
    return role;
  }

  private async _getAppOptions() {
    const apps = await this.roles_repo.getAllActiveApps();
    return apps.map((a) => ({
      value: a.app_id,
      label: `${a.app_name} (${a.app_shortcut})`,
    }));
  }

  private async _resolveSelection(roleId: number, params: any) {
    const hasAnyParam =
      params?.apps !== undefined ||
      params?.modules !== undefined ||
      params?.run_types !== undefined;

    if (!hasAnyParam) {
      return this._loadFromDb(roleId);
    }

    return this._resolveFromParams(params);
  }

  private async _loadFromDb(roleId: number) {
    const assigned = await this.roles_repo.getAssignedXPermissions(roleId);
    const assignedIds = assigned.map((r) => r.xrp_xr_id);

    if (!assignedIds.length) {
      return { selectedApps: [], selectedModules: [], selectedRunTypeIds: [] };
    }

    const details = await this.roles_repo.getRunTypeDetailsById(assignedIds);
    return {
      selectedApps: [...new Set(details.map((r) => r.xm_xa_id))],
      selectedModules: [...new Set(details.map((r) => r.xr_xm_id))],
      selectedRunTypeIds: details.map((r) => r.xr_id),
    };
  }

  private async _resolveFromParams(params: any) {
    const selectedApps = parseIds(params?.apps);
    const selectedModules = parseIds(params?.modules);
    const selectedRunTypeIds = parseIds(params?.run_types);

    if (!selectedApps.length) {
      return { selectedApps: [], selectedModules: [], selectedRunTypeIds: [] };
    }

    const allowedModules = await this.roles_repo.getModulesByApps(selectedApps);
    const allowedModuleIds = allowedModules.map((m) => Number(m.value));
    const validModules = selectedModules.filter((mId) =>
      allowedModuleIds.includes(Number(mId)),
    );

    if (!validModules.length) {
      return { selectedApps, selectedModules: [], selectedRunTypeIds: [] };
    }

    const allowedRunTypes =
      await this.roles_repo.getRunTypesByModules(validModules);
    const allowedRunTypeIds = allowedRunTypes.map((r) => Number(r.value));
    const validRunTypes = selectedRunTypeIds.filter((rId) =>
      allowedRunTypeIds.includes(Number(rId)),
    );

    return {
      selectedApps,
      selectedModules: validModules,
      selectedRunTypeIds: validRunTypes,
    };
  }
}
