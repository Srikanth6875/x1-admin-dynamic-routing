import { Form, Link } from "react-router";
import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-[oklch(27%_0.03_240)] text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold ml-[80px]">X1</h1>

        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-[oklch(28%_0.02_260)] transition-colors"
        >
          ☰
        </button>

        <nav className="hidden md:flex gap-3 text-sm">
          {items.map((item) => (
            <Link
              key={item.name}
              to={`/list/${item.appType}/${item.runType}`}
              className="hover:opacity-80"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-8 h-8 rounded-full bg-[oklch(30%_0.02_260)] flex items-center justify-center font-semibold"
        >
          A
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 min-h-[160px] rounded-lg bg-white text-gray-800 shadow-xl flex flex-col">
            <div className="px-4 py-4">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-sm text-gray-600">Atamai@gmail.com</p>
            </div>

            <div className="mt-auto">
              <Form method="post" action="/logout">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
