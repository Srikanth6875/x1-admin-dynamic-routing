import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import bcrypt from "bcrypt";
import type {
  BuildFormResult,
  SaveFormResult,
} from "~/types/form-builder.types";
import {
  CLARITY_DATA_TABLE_UNIQUE_IDS,
  TABLE_NAMES,
} from "~/shared/contstants";
import { UIComponentType } from "~/shared/admin.enums";
import {
  USER_FIELDS,
  USER_TABLE_ACTION_CONFIG,
  USER_USER_TYPE_MAP_FIELDS,
  USERS_COLUMNS_CONFIG,
  USERS_TABLE_CONFIG,
} from "./user-settimgs";
import { requestStore } from "~/database/request-store";
import { getRecordId, handleDbError } from "~/server/frame-work/forms-service";
import { UserRepository } from "./user.repository";
export class UserAppService extends FrameWorkAppService {
  private readonly db = new UserRepository();

  protected async UserList() {
    const sqlQuery = this.query({ u: TABLE_NAMES.USERS })
      .leftJoin({ ut: "user_types" }, "u.u_ut_id", "ut.ut_id")
      .select(
        "u.u_id",
        "u.u_username",
        "u.u_email",
        this.query.raw(`
        CASE WHEN u.u_status = 1 THEN 'Active' ELSE 'Inactive' END as u_status
      `),
        this.query.raw(`
        COALESCE(ut.ut_name, 'Not Assigned') as user_type
      `),
        "u.u_created_time",
        "u.u_last_updated",
      )
      .orderBy("u.u_id", "desc");

    return await this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.USERS,
      columns: USERS_COLUMNS_CONFIG,
      configOverrides: USERS_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: USER_TABLE_ACTION_CONFIG.heading,
      row_actions: USER_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddUser(del: boolean = false): Promise<BuildFormResult> {
    return this.BuildForm({
      fields: this.removePasswordForEdit(),
      url_cols: {
        APP_TYPE: "USER",
        ID_COL: "u_id",
        ACTION: "SAVE_USER",
        CANCEL_ACTION: "GET_USERS",
        TABLE: "users",
        HEADER: "User",
      },
      del,
    });
  }

  private removePasswordForEdit() {
    const fields = USER_FIELDS();
    const params = requestStore.tryGet()?.query ?? {};
    const recordId = getRecordId(params, "u_id");
    if (recordId) delete fields.password;
    return fields;
  }

  protected async EditUser(): Promise<BuildFormResult> {
    return this.AddUser();
  }

  async UserSave(): Promise<SaveFormResult> {
    await this.hashPasswordIfNeeded();
    return this.SaveFormData("users", USER_FIELDS(), "u_id");
  }

  private async hashPasswordIfNeeded(): Promise<void> {
    const formData = requestStore.tryGet()?.formData ?? {};
    const recordId = getRecordId(formData, "u_id");
    if (
      !recordId &&
      typeof formData.password === "string" &&
      formData.password.trim() !== ""
    ) {
      formData.password = await bcrypt.hash(formData.password, 10);
    }
  }

  protected async UserDelete(): Promise<BuildFormResult> {
    return this.AddUser(true);
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

  protected async UserTypeMap(): Promise<BuildFormResult> {
    const params = requestStore.tryGet()?.query ?? {};
    const userId = getRecordId(params, "u_id");
    if (!userId) throw new Error("User ID required");

    const user = await this.db.getUserById(userId);
    const userTypes = await this.db.getActiveUserTypes();

    const fields = USER_USER_TYPE_MAP_FIELDS(userTypes);

    if (user) {
      fields.u_id.default = user.u_id;
      fields.username.default = user.u_username;
    }

    return this.BuildForm({
      fields,
      initialValues: {
        u_id: user?.u_id ?? "",
        username: user?.u_username ?? "",
        user_type: user?.u_ut_id ?? "",
      },
      url_cols: {
        APP_TYPE: "USER",
        ID_COL: "u_id",
        ACTION: "SAVE_USER_TYPE_MAP",
        CANCEL_ACTION: "GET_USERS",
        TABLE: "users",
        HEADER: "User Type Mapping",
      },
    });
  }

  protected async SaveUserTypeMap(): Promise<SaveFormResult> {
    const data = (requestStore.tryGet()?.formData ?? {}) as any;
    const userId = Number(data.u_id);
    const userTypeId = Number(data.user_type);

    try {
      await this.query("users")
        .where("u_id", userId)
        .update({ u_ut_id: userTypeId });

      return { success: true };
    } catch (err) {
      return handleDbError(err);
    }
  }
}
