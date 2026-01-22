import type { ActionFunction } from "react-router";
import { logoutSession } from "~/__auth/auth-session.service";

export const action: ActionFunction = async ({ request }) => {
  // logoutSession returns a redirect to /login
  return logoutSession(request);
};

export default function Logout() {
  return  null; // no UI
}
