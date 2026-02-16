import { redirect } from "react-router";
import { generateUUID } from "~/shared/util-helper";
import { setSessionDataInRedis, getSessionDataInRedis, deleteSessionInRedis, getSessionIdFromRequest, commitSessionCookie, destroySessionCookie, SESSION_TIMEOUT_MS, } from "~/auth-sessions/user-session-server";
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
export async function createUserSession(userId: number, userName: string, redirectTo: string) {
  const sessionId = generateUUID();

  const sessionData = {
    userId,
    userName,
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
  const { userId, userName, lastActivity } = data;
  const now = Date.now();

  // Expired
  if (!lastActivity || now - lastActivity > SESSION_TIMEOUT_MS) {
    await deleteSessionInRedis(sessionId);

    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySessionCookie(),
      },
    });
  }
  // Refresh TTL + last activity
  const updatedData = { userId, userName, lastActivity: now };
  await setSessionDataInRedis(sessionId, updatedData);

  return {
    userId,
    headers: {
      "Set-Cookie": await commitSessionCookie(sessionId),
    },
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
