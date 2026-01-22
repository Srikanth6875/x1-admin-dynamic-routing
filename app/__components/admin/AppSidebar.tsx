import { Link, useParams } from "react-router";

type SidebarItem = {
  name: string;
  appType: string;
  runType: string;
};

type AppSidebarProps = {
  sidebarOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  items: SidebarItem[];
};

export function AppSidebar({
  sidebarOpen,
  isMobile,
  onClose,
  items,
}: AppSidebarProps) {
  const { appType, runType } = useParams();

  return (
    <>
      <aside className={`fixed top-12 left-0 bottom-0 w-56 bg-white shadow-xl z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full p-6">
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive =
                item.appType === appType && item.runType === runType;

              return (
                <Link
                  key={item.name}
                  to={`/${item.appType}/${item.runType}`}
                  onClick={isMobile ? onClose : undefined}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium
                    ${isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}
    </>
  );
}
