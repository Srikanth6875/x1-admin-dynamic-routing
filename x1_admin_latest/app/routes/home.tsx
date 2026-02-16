import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSession } from "~/auth-sessions/auth-session.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session?.data?.userId) {
    // Access session.userId from Redis session
    return redirect("/list/ROOFTOPS/GET_ROOFTOPS");
  }
  return redirect("/login");
}

export default function Index() {
  return null; // index route does not render anything
}
