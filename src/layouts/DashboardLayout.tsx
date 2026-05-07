import { useEffect, useState } from "react";
import {
  DollarSign,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sun,
  Users,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import Tooltip from "../components/ui/Tooltip";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleChangeTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/clients", label: "Clients", icon: Users },
    { path: "/sales", label: "Sales", icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-sidebar text-sidebar-foreground flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Client Analytics</h1>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => {
                  return `flex items-center gap-3 px-3 py-2 mb-1 rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-800 text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-amber-800 hover:text-sidebar-accent-foreground"
                  }`;
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-semibold lg:hidden">Client Analytics</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            {/* Commented for now. To be implemented in a future feature */}
            {/* <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button> */}
            {!darkMode ? (
              <Tooltip content="Switch to dark mode" position="left">
                <Moon className="cursor-pointer" onClick={handleChangeTheme} />
              </Tooltip>
            ) : (
              <Tooltip content="Switch to light mode" position="left">
                <Sun className="cursor-pointer" onClick={handleChangeTheme} />
              </Tooltip>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
