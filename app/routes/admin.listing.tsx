import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireUserSession } from "~/auth-sessions/auth-session.service";
import { executeWithPermission } from "~/run-engine/reflection-executor.server";
import { FrameworkRenderer } from "~/client/framework-renderer";
import type { TableRenderDescriptor } from "~/types/listining-types";
import { UserAuthService } from "~/auth-sessions/auth-app.service";
import { filterUserCanRBAC } from "~/auth-sessions/user-policy";

export type ListingLoaderData = {
  render_response: TableRenderDescriptor;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { userId, headers } = await requireUserSession(request).catch(() => {
    throw redirect("/login");
  });

  const permissions = await UserAuthService.getUserPermissions(userId);

  const appType = params["app-type"];
  const runType = params["run-type"];

  if (!appType || !runType) {
    throw new Response("Missing parameters", { status: 400 });
  }
  const render_response = await executeWithPermission({ userId, app_type: appType, run_type: runType });
  const filteredRender = filterUserCanRBAC(render_response, permissions!);

  return new Response(JSON.stringify({ render_response: filteredRender }), {
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });
}

export default function AdminDynamicRoute() {
  const { render_response } = useLoaderData<ListingLoaderData>();

  return <FrameworkRenderer render={render_response as any} />;
}
