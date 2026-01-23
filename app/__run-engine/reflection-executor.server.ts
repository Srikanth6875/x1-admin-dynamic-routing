import { ReflectionRegistry } from "~/__run-engine/reflection-registry.service";
import { AuthService } from "~/__auth/auth-app.service";
import type { PermissionExecuteArgs } from "~/__shared-constants/core-listing-types";

export async function executeWithPermission({ userId, app_type, run_type, payload = [], }: PermissionExecuteArgs) {
  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type, run_type);

  if (!permission) {
    throw new Response("Forbidden", { status: 403 });
  }
  const { class_Name, class_Method_Name } = permission;

  return await ReflectionRegistry.executeReflectionEngine(class_Name, class_Method_Name, payload);
}
