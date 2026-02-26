import { redirect } from "react-router";
import { generateUUID } from "~/shared/util-helper";
import {
  setSessionDataInRedis,
  getSessionDataInRedis,
  deleteSessionInRedis,
  getSessionIdFromRequest,
  commitSessionCookie,
  destroySessionCookie,
  SESSION_TIMEOUT_MS,
} from "~/auth-sessions/user-session-server";
import { UserAuthService } from "./auth-app.service";
import { setCachedPermissions } from "./user-policy";

/** Get full session (id + data) */
export async function getSession(request: Request) {
  const sessionId = await getSessionIdFromRequest(request);
  if (!sessionId) return null;

  const data = await getSessionDataInRedis(sessionId);
  if (!data) return null;
  return { sessionId, data };
}

/** Create session after login */
export async function createUserSession(
  userId: number,
  userName: string,
  email: string,
  redirectTo: string,
) {
  const sessionId = generateUUID();

  const permissionMap = await UserAuthService.getUserPermissions(userId);

  const sessionData = {
    userId,
    userName,
    email,
    permissions: Object.fromEntries(
      Array.from(permissionMap.entries()).map(([k, v]) => [k, Array.from(v)]),
    ),
    lastActivity: Date.now(),
  };

  console.log("sessionData", sessionData);

  await setSessionDataInRedis(sessionId, sessionData);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSessionCookie(sessionId),
    },
  });
}

export async function requireUserSession(request: Request) {
  const session = await getSession(request);
  if (!session) throw redirect("/login");

  const { sessionId, data } = session;
  const now = Date.now();

  if (!data.lastActivity || now - data.lastActivity > SESSION_TIMEOUT_MS) {
    await deleteSessionInRedis(sessionId);

    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySessionCookie(),
      },
    });
  }

  const updatedData = {
    ...data,
    lastActivity: now,
  };

  await setSessionDataInRedis(sessionId, updatedData);

  await commitSessionCookie(sessionId);

  return {
    userId: data.userId,
    userName: data.userName,
    email: data.email,
    permissions: data.permissions,
  };
}

/** Logout user */
export async function logoutSession(request: Request) {
  const sessionId = await getSessionIdFromRequest(request);
  if (sessionId) await deleteSessionInRedis(sessionId);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySessionCookie(),
    },
  });
}
