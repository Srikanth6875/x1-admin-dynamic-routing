import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requestStore } from "~/database/request-store";
import { requireUserSession } from "~/auth-sessions/auth-session.service";
import { executeWithPermission } from "~/run-engine/reflection-executor.server";
import { FrameworkRenderer } from "~/client/framework-renderer";
import type { RenderResult } from "~/types/listining-types";

type LoaderData = {
  details: RenderResult;
  userId: number;
};

export const loader = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const urlParams = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );

  return requestStore.run(
    {
      formData: {},
      query: urlParams,
    },
    async () => {
      const { userId } = await requireUserSession(request).catch(() => {
        throw redirect("/login");
      });

      const appType = params["app-type"];
      const runType = params["run-type"];

      if (!appType || !runType) {
        throw new Response("Missing parameters", { status: 400 });
      }

      const details = (await executeWithPermission({
        userId,
        app_type: appType,
        run_type: runType,
      })) as RenderResult;

      return { details, userId };
    },
  );
};

export default function DetailsPage() {
  const { details } = useLoaderData<LoaderData>();

  return <FrameworkRenderer render={details} />;
}
