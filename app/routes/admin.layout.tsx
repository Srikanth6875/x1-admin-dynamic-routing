import { useState, useEffect } from "react";
import { Outlet, useLocation, redirect, type LoaderFunctionArgs, useNavigation, } from "react-router";
import { AppHeader } from "~/__components/admin/AppHeader";
import { AppSidebar } from "~/__components/admin/AppSidebar";
import { requireUserSession } from "~/__auth/auth-session.service";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await requireUserSession(request);
    return null;
  } catch {
    throw redirect("/login");
  }
}

export const topNavItems = [
  // { name: "rooftops", appType: "ROOFTOPS", runType: "GET_ROOFTOPS" },
  // { name: "Vehicles", appType: "VEHICLES", runType: "VEHICLE_LIST" },
];

export const sidebarItems = [
  { name: "rooftops", appType: "ROOFTOPS", runType: "GET_ROOFTOPS" },
  { name: "Vehicles", appType: "VEHICLES", runType: "VEHICLE_LIST" },
  { name: "Makes", appType: "MAKE", runType: "MAKE_LIST" },
];

export default function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        items={topNavItems}
      />

      <AppSidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
        items={sidebarItems}
      />

      <main
        className={`pt-12 transition-all duration-300 ${sidebarOpen ? "md:pl-56" : "md:pl-0"
          }`}
      >
        <div className="p-3 md:p-4 max-w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
