import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireUserSession } from "~/auth-sessions/auth-session.service";
import { executeWithPermission } from "~/run-engine/reflection-executor.server";
import { FrameworkRenderer } from "~/client/framework-renderer";
import type { TableRenderDescriptor } from "~/shared/listining-types";

export type ListingLoaderData = {
  render_response: TableRenderDescriptor;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { userId, sessionId, headers } = await requireUserSession(request).catch(() => {
    throw redirect("/login");
  });

  const appType = params["app-type"];
  const runType = params["run-type"];

  if (!appType || !runType) {
    throw new Response("Missing parameters", { status: 400 });
  }
  const render_response = await executeWithPermission({ userId, app_type: appType, run_type: runType, });

  return new Response(JSON.stringify({ render_response }), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export default function AdminDynamicRoute() {
  const { render_response } = useLoaderData<ListingLoaderData>();
  return <FrameworkRenderer render={render_response as any} />;
}
