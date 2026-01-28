import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSession } from "~/auth/auth-session.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);

  const userId = session?.get("userId"); // safe check
  if (userId) {
    return redirect("/list/ROOFTOPS/GET_ROOFTOPS");
  }

  return redirect("/login");
}

export default function Index() {
  return null; // index route does not render anything
}
