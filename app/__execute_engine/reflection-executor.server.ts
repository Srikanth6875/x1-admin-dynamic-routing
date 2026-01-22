import { ReflectionRegistry } from "~/__execute_engine/reflection-registry.service";
import { AuthService } from "~/__auth/auth-app.service";

type ExecuteArgs = {
  userId: number;
  app_type: string;
  run_type?: string;
  payload?: any[];
};

export async function executeWithPermission({ userId, app_type, run_type, payload = [], }: ExecuteArgs) {
  const auth = new AuthService();
  const permission = await auth.checkUserPermission(userId, app_type, run_type);
  // console.log("@@@@@@@@@@@", permission);

  if (!permission) {
    throw new Response("Forbidden", { status: 403 });
  }

  const { class_Name, class_Method_Name } = permission;
  
  return await ReflectionRegistry.executeReflectionEngine(class_Name, class_Method_Name, payload);
}
