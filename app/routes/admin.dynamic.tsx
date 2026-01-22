import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireUserSession } from "~/__auth/auth-session.service";
import { executeWithPermission } from "~/__execute_engine/reflection-executor.server";
import { FrameworkRenderer } from "~/__clarity-admin/framework-renderer";
import type { UIComponentType } from "~/__shared-constants/ui.enums";

export type TableRenderDescriptor = {
  type: UIComponentType.TABLE;
  payload: {
    data: any[];
    columns: any[];
    config: any;
  };
};

export type LoaderData = {
  render: TableRenderDescriptor;
  appType: string;
  runType: string;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const { userId, headers } = await requireUserSession(request).catch(() => {
    throw redirect("/login");
  });

  const appType = params["app-type"];
  const runType = params["run-type"];

  if (!appType || !runType) {
    throw new Response("Missing parameters", { status: 400 });
  }
  console.time("refEXE");
  const render = await executeWithPermission({ userId, app_type: appType, run_type: runType });
  console.timeEnd("refEXE");
  return new Response(JSON.stringify({ render, appType, runType }), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
};

export default function AdminDynamicRoute() {
  const { render } = useLoaderData<LoaderData>();

  return (
    <section>
      <FrameworkRenderer render={render} />
    </section>
  );
}
