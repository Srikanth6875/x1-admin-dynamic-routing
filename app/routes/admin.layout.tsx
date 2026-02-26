import { useState, useEffect } from "react";
import {
  Outlet,
  useLocation,
  redirect,
  type LoaderFunctionArgs,
  useNavigation,
  useRouteError,
  useLoaderData,
} from "react-router";

import { AppHeader } from "~/client/components/helper-components/AppHeader";
import { AppSidebar } from "~/client/components/helper-components/AppSidebar";
import { requireUserSession } from "~/auth-sessions/auth-session.service";
import { sidebarItems, topNavItems } from "~/shared/contstants";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const session = await requireUserSession(request);
    return session;
  } catch {
    throw redirect("/login");
  }
}

export default function AppLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const { permissions, userName, email } = useLoaderData<typeof loader>();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isLoading = navigation.state === "loading";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  function filterMenu(items: any[], permissions: Record<string, string[]>) {
    if (!permissions) return [];

    return items.filter((item) => {
      const appPerms = permissions[item.appType];
      return appPerms?.includes(item.runType);
    });
  }

  console.log("topNavItems---",topNavItems,"----sidebarItems",sidebarItems);
console.log("permission",permissions);
  
  const filteredTopNav = filterMenu(topNavItems, permissions);
  const filteredSidebar = filterMenu(sidebarItems, permissions);

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <AppHeader
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        items={filteredTopNav}
        userName={userName}
        email={email}
      />

      {isLoading && (
        <div className="fixed top-12 left-0 z-30 h-[3px] w-full overflow-hidden bg-[oklch(64.5%_0.246_16.439_/_0.25)]">
          <div className="h-full w-full animate-loading-bar bg-[oklch(64.5%_0.246_16.439)]" />
        </div>
      )}

      <AppSidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
        items={filteredSidebar}
      />

      <main
        className={`pt-12 transition-all duration-300 ${
          sidebarOpen ? "md:pl-56" : "md:pl-0"
        }`}
      >
        <div className="p-3 md:p-4 max-w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Admin Error:", error);

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Section Error</h1>
      <pre>
        {error instanceof Error ? error.message : JSON.stringify(error)}
      </pre>
    </div>
  );
}
