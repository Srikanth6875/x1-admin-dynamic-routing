import bcrypt from "bcrypt";
import { ShellEngine } from "~/server/frame-work/shell-engine-service";
import { TABLE_NAMES } from "~/shared/contstants";
export interface User {
  id: number;
  username: string;
  email: string;
}

export class AuthService extends ShellEngine {
  constructor() {
    super();
  }

  async validateLogin(email: string, password: string): Promise<User | null> {
    const user = await this.query(TABLE_NAMES.USERS)
      .where({ u_email: email.trim(), u_status: 1 })
      .first();

    if (!user) return null;

    const match = await bcrypt.compare(password, user.u_password_hash);
    if (!match) return null;

    return {
      id: user.u_id,
      username: user.u_username,
      email: user.u_email,
    };
  }

  async checkUserPermission(userId: number, appType: string, runType?: string) {
    if (runType) {
      return await this.getRunTypePermission(userId, appType, runType);
    }
    return await this.getDefaultAppPermission(userId, appType);
  }

  private async getRunTypePermission(userId: number, appType: string, runType: string) {
    const row = await this.query("users as u")
      .join("user_role_map as urm", "u.u_id", "urm.urm_u_id")
      .join("roles as r", "urm.urm_r_id", "r.r_id")
      .join("role_permissions as rp", "r.r_id", "rp.rp_r_id")
      .join("app_run_types as ar", "rp.rp_app_run_type_id", "ar.ar_id")
      .join("app_types as a", "ar.ar_a_id", "a.a_id")
      .where({
        "u.u_id": userId,
        "u.u_status": 1,
        "r.r_status": 1,
        "a.a_type": appType,
        "ar.ar_type": runType,
      })
      .select("ar.ar_class as class_Name", "ar.ar_method as class_Method_Name")
      .first();
    return row ?? null;
  }

  private async getDefaultAppPermission(userId: number, appType: string) {
    const row = await this.query("users as u")
      .join("user_role_map as urm", "u.u_id", "urm.urm_u_id")
      .join("roles as r", "urm.urm_r_id", "r.r_id")
      .join("role_permissions as rp", "r.r_id", "rp.rp_r_id")
      .join("app_types as a", "rp.rp_app_type_id", "a.a_id")
      .where({
        "u.u_id": userId,
        "u.u_status": 1,
        "r.r_status": 1,
        "a.a_type": appType,
      })
      .select("a.a_default_class as class_Name", "a.a_default_method as class_Method_Name")
      .first();
    return row ?? null;
  }

  async getUserAppRunMap(
    userId: number
  ): Promise<Map<string, Set<string>>> {
    const rows = await this.query("users as u")
      .join("user_role_map as urm", "urm.urm_u_id", "u.u_id")
      .join("roles as r", "r.r_id", "urm.urm_r_id")
      .join("role_permissions as rp", "rp.rp_r_id", "r.r_id")
      .join("app_types as a", "a.a_id", "rp.rp_app_type_id")
      .join("app_run_types as art", "art.ar_id", "rp.rp_app_run_type_id")
      .where("u.u_id", userId)
      .where("r.r_status", 1)
      .select(
        "u.u_id",
        "a.a_type as app_type",
        "art.ar_type as run_type"
      );

    const permissionMap = new Map<string, Set<string>>();

    for (const row of rows) {
      if (!permissionMap.has(row.app_type)) {
        permissionMap.set(row.app_type, new Set());
      }

      permissionMap.get(row.app_type)!.add(row.run_type);
    }

    return permissionMap;
  }
}
