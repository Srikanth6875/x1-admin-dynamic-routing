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
}