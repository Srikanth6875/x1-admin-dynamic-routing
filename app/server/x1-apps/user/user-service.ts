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
import { UserRepository } from "./user.repository";
import {
  USERS_COLUMNS_CONFIG,
  USERS_TABLE_CONFIG,
  USER_TABLE_ACTION_CONFIG,
  USER_FIELDS,
} from "./user-settimgs";

export class UserAppService extends FrameWorkAppService {
  private readonly db = new UserRepository();

  protected async UserList() {
    const sqlQuery = this.query({ u: TABLE_NAMES.USERS })
      .leftJoin({ ut: "user_types" }, "u.u_ut_id", "ut.ut_id")
      .select(
        "u.u_id",
        "u.u_username",
        "u.u_email",
        this.query.raw(
          `CASE WHEN u.u_status = 1 THEN 'Active' ELSE 'Inactive' END as u_status`,
        ),
        this.query.raw(`COALESCE(ut.ut_name, 'Not Assigned') as user_type`),
        "u.u_created_time",
        "u.u_last_updated",
      )
      .orderBy("u.u_id", "desc");

    return this.BuildClarityDataTable({
      sqlQuery,
      table_unique_id: CLARITY_DATA_TABLE_UNIQUE_IDS.USERS,
      columns: USERS_COLUMNS_CONFIG,
      configOverrides: USERS_TABLE_CONFIG,
      component_type: UIComponentType.TABLE,
      table_header: USER_TABLE_ACTION_CONFIG.heading,
      row_actions: USER_TABLE_ACTION_CONFIG.rowActions,
    });
  }

  async AddUser(del = false): Promise<BuildFormResult> {
    const userTypeOptions = await this.db.getActiveUserTypes();
    const fields = this.buildFields(userTypeOptions);

    return this.BuildForm({
      fields,
      url_cols: {
        APP_TYPE: "USER",
        ID_COL: "u_id",
        ACTION: "SAVE_USER",
        CANCEL_ACTION: "GET_USERS",
        TABLE: "users",
        HEADER: "User",
      },
      initialValues:{
        status:1
      },
      del,
    });
  }

  protected async EditUser(): Promise<BuildFormResult> {
    return this.AddUser();
  }

  protected async UserDelete(): Promise<BuildFormResult> {
    return this.AddUser(true);
  }

  async UserSave(): Promise<SaveFormResult> {
    await this.hashPassword();
    const userTypeOptions = await this.db.getActiveUserTypes();
    return this.SaveFormData("users", USER_FIELDS(userTypeOptions), "u_id");
  }

  private buildFields(userTypeOptions: { label: string; value: number }[]) {
    const fields = USER_FIELDS(userTypeOptions);
    if (this.getQueryRecordId("u_id")) delete fields.password;
    return fields;
  }

  private async hashPassword(): Promise<void> {
    const formData = this.getFormData();
    const recordId = this.getFormRecordId("u_id");
    if (
      !recordId &&
      typeof formData.password === "string" &&
      formData.password.trim()
    ) {
      formData.password = await bcrypt.hash(formData.password, 10);
    }
  }

}
