import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";

export class RoleRepository extends FrameWorkAppService {
  async getRoleById(roleId: number) {
    return this.query("roles")
      .select("r_id", "r_name", "r_status")
      .where("r_id", roleId)
      .first();
  }

  async createRole(data: {
    r_name: string;
    r_status: number;
  }): Promise<number> {
    const [row] = await this.query("roles")
      .insert({
        r_name: data.r_name,
        r_status: data.r_status,
      })
      .returning("r_id");

    return Number(row.r_id);
  }

  async getAllActiveApps() {
    return this.query("x_apps")
      .select(
        "xa_id as app_id",
        "xa_name as app_name",
        "xa_shortcut as app_shortcut",
      )
      .where("xa_status", 1)
      .orderBy("xa_name", "asc")
      .then((rows) =>
        rows.map((r) => ({
          app_id: Number(r.app_id),
          app_name: r.app_name,
          app_shortcut: r.app_shortcut,
        })),
      );
  }

  async getModulesByApps(appIds: number[]) {
    if (appIds.length === 0) return [];

    const rows = await this.query({ xm: "x_app_modules" })
      .join({ xa: "x_apps" }, "xa.xa_id", "xm.xm_xa_id")
      .select(
        "xm.xm_id as value",
        "xm.xm_name",
        "xm.xm_shortcut",
        "xa.xa_id as app_id",
        "xa.xa_name as app_name",
        "xa.xa_shortcut as app_shortcut",
      )
      .where("xm.xm_status", 1)
      .whereIn("xm.xm_xa_id", appIds)
      .orderBy("xa.xa_name", "asc")
      .orderBy("xm.xm_name", "asc");

    return rows.map((m) => ({
      value: Number(m.value),
      label: `${m.app_name} (${m.app_shortcut}) — ${m.xm_name} (${m.xm_shortcut})`,
      apps: Number(m.app_id),
    }));
  }

  async getAssignedXPermissions(roleId: number) {
    const rows = await this.query("x_role_permissions")
      .select("xrp_xr_id")
      .where("xrp_role_id", roleId);

    return rows.map((r) => ({ xrp_xr_id: Number(r.xrp_xr_id) }));
  }

  async getRunTypesByModules(moduleIds: number[]) {
    if (moduleIds.length === 0) return [];

    const rows = await this.query({ xr: "x_app_run_types" })
      .join({ xm: "x_app_modules" }, "xm.xm_id", "xr.xr_xm_id")
      .join({ xa: "x_apps" }, "xa.xa_id", "xm.xm_xa_id")
      .select(
        "xr.xr_id as value",
        "xr.xr_method",
        "xm.xm_id as modules",
        "xm.xm_name as module_name",
        this.query.raw("CONCAT(xm.xm_name, ' - ', xr.xr_method) as label"),
      )
      .where("xr.xr_status", 1)
      .whereNotNull("xr.xr_xm_id")
      .whereIn("xr.xr_xm_id", moduleIds)
      .orderBy("xm.xm_id", "asc")
      .orderBy("xr.xr_method", "asc");

    return rows.map((r) => ({
      value: Number(r.value),
      label: r.label || `${r.module_name} - ${r.xr_method}`,
      modules: Number(r.modules),
      app_type_id: String(r.modules),
    }));
  }

  async saveRolePermissions(roleId: number, runTypeIds: number[]) {
    await this.query("x_role_permissions").where("xrp_role_id", roleId).del();

    if (runTypeIds.length > 0) {
      await this.query("x_role_permissions").insert(
        runTypeIds.map((id) => ({
          xrp_role_id: roleId,
          xrp_xr_id: id,
          xrp_status: 1,
        })),
      );
    }
  }

  async updateRole(
    roleId: number,
    data: { r_name: string; r_status: number },
  ): Promise<void> {
    await this.query("roles").where("r_id", roleId).update({
      r_name: data.r_name,
      r_status: data.r_status,
    });
  }
  async getRunTypeDetailsById(runTypeIds: number[]) {
    if (runTypeIds.length === 0) return [];

    const rows = await this.query({ xr: "x_app_run_types" })
      .join({ xm: "x_app_modules" }, "xm.xm_id", "xr.xr_xm_id")
      .join({ xa: "x_apps" }, "xa.xa_id", "xm.xm_xa_id")
      .select("xr.xr_id", "xr.xr_xm_id", "xm.xm_xa_id")
      .whereIn("xr.xr_id", runTypeIds)

      .where("xa.xa_status", 1)
      .where("xm.xm_status", 1)
      .where("xr.xr_status", 1)

      .whereNotNull("xr.xr_xm_id")
      .whereNotNull("xm.xm_xa_id");

    return rows.map((r) => ({
      xr_id: Number(r.xr_id),
      xr_xm_id: Number(r.xr_xm_id),
      xm_xa_id: Number(r.xm_xa_id),
    }));
  }

  async validateRunTypesForHierarchy(
    appIds: number[],
    moduleIds: number[],
    runTypeIds: number[],
  ) {
    if (!runTypeIds.length) return [];

    const rows = await this.query({ xr: "x_app_run_types" })
      .join({ xm: "x_app_modules" }, "xr.xr_xm_id", "xm.xm_id")
      .join({ xa: "x_apps" }, "xm.xm_xa_id", "xa.xa_id")
      .select("xr.xr_id")
      .whereIn("xr.xr_id", runTypeIds)
      .whereIn("xa.xa_id", appIds)
      .whereIn("xm.xm_id", moduleIds)
      .where("xa.xa_status", 1)
      .where("xm.xm_status", 1)
      .where("xr.xr_status", 1);

    return rows.map((r) => Number(r.xr_id));
  }

  async getRolePermissionXDetails(roleId: number) {
    const rows = await this.query({ xrp: "x_role_permissions" })
      .join({ xr: "x_app_run_types" }, "xr.xr_id", "xrp.xrp_xr_id")
      .join({ xm: "x_app_modules" }, "xm.xm_id", "xr.xr_xm_id")
      .join({ xa: "x_apps" }, "xa.xa_id", "xm.xm_xa_id")
      .select(
        "xa.xa_id",
        "xa.xa_name",
        "xm.xm_id",
        "xm.xm_name",
        "xr.xr_method",
      )
      .where("xrp.xrp_role_id", roleId)
      .where("xa.xa_status", 1)
      .where("xm.xm_status", 1)
      .where("xr.xr_status", 1)
      .orderBy(["xa.xa_name", "xm.xm_name", "xr.xr_method"]);

    const grouped = new Map<
      string,
      { app_name: string; module_name: string; run_types: string[] }
    >();

    for (const row of rows) {
      const key = `${row.xa_id}-${row.xm_id}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          app_name: row.xa_name,
          module_name: row.xm_name,
          run_types: [],
        });
      }

      grouped.get(key)!.run_types.push(row.xr_method);
    }

    return Array.from(grouped.values()).map((g) => ({
      app_name: g.app_name,
      module_name: g.module_name,
      run_types: g.run_types.join(", "),
    }));
  }
}
