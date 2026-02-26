import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";

export class UserRepository extends FrameWorkAppService {
  async getUserById(userId: number) {
    return this.query("users")
      .select("u_id", "u_username", "u_ut_id")
      .where("u_id", userId)
      .first();
  }

  async getActiveUserTypes() {
    return this.query("user_types")
      .select("ut_id as value", "ut_name as label")
      .where("ut_status", 1);
  }

  async getActiveRoles() {
    return this.query("roles")
      .select("r_id as value", "r_name as label")
      .where("r_status", 1);
  }

  async getAssignedRoles(userId: number) {
    return this.query("user_role_map")
      .select("urm_r_id")
      .where("urm_u_id", userId);
  }

  async replaceUserRoles(userId: number, roleIds: number[]) {
    await this.query("user_role_map").where("urm_u_id", userId).del();
    if (roleIds.length === 0) return;
    await this.query("user_role_map").insert(
      roleIds.map((roleId) => ({
        urm_u_id: userId,
        urm_r_id: roleId,
      })),
    );
  }
}
