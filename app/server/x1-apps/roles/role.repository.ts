import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";

export class RoleRepository extends FrameWorkAppService {
  async getRoleById(roleId: number) {
    return this.query("roles")
      .select("r_id", "r_name")
      .where("r_id", roleId)
      .first();
  }

  async getAssignedPermissions(roleId: number) {
    return this.query("role_permissions")
      .select("rp_app_type_id", "rp_app_run_type_id")
      .where("rp_r_id", roleId);
  }

  async getAllAppTypes() {
    return this.query("app_types").select("a_id as value", "a_type as label");
  }
  
  async getRunTypesForAppTypes(appTypeIds: number[]) {
    if (appTypeIds.length === 0) return [];
    const rows = await this.query("app_run_types")
      .join("app_types", "app_types.a_id", "app_run_types.ar_a_id")
      .select(
        "ar_id as value",
        "ar_type as label",
        "ar_a_id as app_type_id",
        "app_types.a_type as app_type_label",
      )
      .whereIn("ar_a_id", appTypeIds)
      .orderBy("ar_a_id", "asc")
      .orderBy("ar_id", "asc");

    return rows.map((rt) => ({
      label: rt.label,
      value: rt.value,
      app_type_id: rt.app_type_id,
      app_type_label: rt.app_type_label, 
    }));
  }

  async validateRunTypes(runTypeIds: number[], appTypeIds: number[]) {
    if (runTypeIds.length === 0) return [];
    return this.query("app_run_types")
      .select("ar_id", "ar_a_id")
      .whereIn("ar_id", runTypeIds)
      .whereIn("ar_a_id", appTypeIds);
  }

  async replaceRolePermissions(
    roleId: number,
    validRunTypes: { ar_id: number; ar_a_id: number }[],
  ) {
    await this.query("role_permissions").where("rp_r_id", roleId).del();
    if (validRunTypes.length === 0) return;
    await this.query("role_permissions").insert(
      validRunTypes.map((rt) => ({
        rp_r_id: roleId,
        rp_app_type_id: rt.ar_a_id,
        rp_app_run_type_id: rt.ar_id,
      })),
    );
  }

  async getRolePermissionsForDetails(roleId: number) {
    const rows = await this.query("role_permissions as rp")
      .join("app_types as at", "at.a_id", "rp.rp_app_type_id")
      .join("app_run_types as art", "art.ar_id", "rp.rp_app_run_type_id")
      .select(
        "at.a_id as app_type_id",
        "at.a_type as app_type",
        "art.ar_type as run_type",
      )
      .where("rp.rp_r_id", roleId)
      .orderBy("at.a_type", "asc")
      .orderBy("art.ar_type", "asc");

    const grouped = new Map<
      number,
      { app_type: string; run_types: string[] }
    >();

    for (const row of rows) {
      if (!grouped.has(row.app_type_id)) {
        grouped.set(row.app_type_id, {
          app_type: row.app_type,
          run_types: [],
        });
      }
      grouped.get(row.app_type_id)!.run_types.push(row.run_type);
    }

    return Array.from(grouped.values()).map((g) => ({
      app_type: g.app_type,
      run_types: g.run_types.join(", "),
    }));
  }
}
