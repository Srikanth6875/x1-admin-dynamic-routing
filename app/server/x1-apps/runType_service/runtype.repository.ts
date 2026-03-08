import { FrameWorkAppService } from "~/server/frame-work/frame-work-app-service";
import { TABLE_NAMES } from "~/shared/contstants";

export class RunTypeRepository extends FrameWorkAppService {
  
  async getRunTypeById(xrId: number) {
    return this.query(TABLE_NAMES.X_APP_RUNTYPE)
      .select("xr_id", "xr_shortcut", "xr_class","xr_method", "xr_xm_id","xr_status")
      .where("xr_id", xrId)
      .first();
  }

  async getActiveApps() {
    return this.query(TABLE_NAMES.X_APPS)
      .select("xa_id as value", "xa_name", "xa_shortcut")
      .where("xa_status", 1)
      .orderBy("xa_name", "asc");
  }

  async getModulesByApp(appId: number) {
    return this.query(TABLE_NAMES.X_APP_MODULE)
      .select("xm_id as value", "xm_name", "xm_shortcut")
      .where("xm_xa_id", appId)
      .where("xm_status", 1)
      .orderBy("xm_name", "asc");
  }

  async getAppIdByModuleId(xmId: number) {
    return this.query(TABLE_NAMES.X_APP_MODULE)
      .select("xm_xa_id")
      .where("xm_id", xmId)
      .first();
  }

  async updateRunTypeModule(xrId: number, xmId: number) {
    return this.query(TABLE_NAMES.X_APP_RUNTYPE)
      .where("xr_id", xrId)
      .update({ xr_xm_id: xmId, xr_last_updated: this.query.raw("CURRENT_TIMESTAMP") });
  }
}