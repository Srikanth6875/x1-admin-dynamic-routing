import { ReflectionRegistry } from "~/__runner-engine/reflection-registry.service";
import { AuthService } from "~/__auth/auth-app.service";
import type { PermissionExecuteArgs } from "~/__shared-constants/core-listing-types";

async function getUserExecutionPermission(userId: number, appType: string, runType?: string) {
  const auth = new AuthService();
  return auth.checkUserPermission(userId, appType, runType);
}

function assertPermission(permission: any) {
  if (!permission) throw new Response("Forbidden permission required", { status: 403 });
  const { class_Name, class_Method_Name } = permission;

  if (!class_Name || !class_Method_Name) {
    throw new Response(`Invalid execution ${class_Name} and ${class_Method_Name} must`, { status: 500 });
  }

  return { class_Name, class_Method_Name };
}

async function executeReflection(className: string, methodName: string, payload: unknown[]) {
  return ReflectionRegistry.executeReflectionEngine(className, methodName, payload);
}


export async function executeWithPermission({ userId, app_type, run_type, payload = [], }: PermissionExecuteArgs) {
  const permission = await getUserExecutionPermission(Number(userId), app_type, run_type);
  const { class_Name, class_Method_Name } = assertPermission(permission);

  return executeReflection(class_Name, class_Method_Name, payload);
}