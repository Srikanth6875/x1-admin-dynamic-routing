import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";

export class UserTypeRepository extends FrameWorkAppService {

  async getActiveRoles() {
    return this.query("roles")
      .select("r_id as value", "r_name as label")
      .where("r_status", 1);
  }

  async getAssignedRoles(utId: number) {
    return this.query("user_type_role_map")
      .select("utr_r_id")
      .where("utr_ut_id", utId);
  }

  async replaceUserTypeRoles(utId: number, roleIds: number[]) {
    await this.query("user_type_role_map").where("utr_ut_id", utId).del();
    if (roleIds.length === 0) return;
    await this.query("user_type_role_map").insert(
      roleIds.map((roleId) => ({
        utr_ut_id: utId,
        utr_r_id: roleId,
      })),
    );
  }
}