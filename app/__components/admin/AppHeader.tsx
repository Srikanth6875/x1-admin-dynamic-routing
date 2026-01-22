import { Link } from "react-router";

type NavItem = {
  name: string;
  appType: string;
  runType: string;
};

type AppHeaderProps = {
  onToggleSidebar: () => void;
  items: NavItem[];
};

export function AppHeader({ onToggleSidebar, items }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-gray-800 text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold ml-[80px]">X1</h1>

        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-600"
        >
          ☰
        </button>

        <nav className="hidden md:flex gap-3 text-sm">
          {items.map((item) => (
            <Link
              key={item.name}
              to={`/${item.appType}/${item.runType}`}
              className="hover:text-gray-300 px-2"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm">Admin</span>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
}
