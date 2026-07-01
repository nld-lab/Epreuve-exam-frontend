import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Building2,
  Users,
  CalendarDays,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const baseNav = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/epreuves", label: "Épreuves", icon: FileText, end: false },
];

const superAdminNav = [
  { to: "/admin/poles", label: "Pôles", icon: Building2, end: false },
  { to: "/admin/filieres", label: "Filières", icon: FolderTree, end: false },
  { to: "/admin/annees", label: "Années", icon: CalendarDays, end: false },
  { to: "/admin/admins", label: "Administrateurs", icon: Users, end: false },
];

export function AdminLayout() {
  const { user, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = isSuperAdmin ? [...baseNav, ...superAdminNav] : baseNav;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-primary/30 md:flex">
        <Link to="/">
        <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
            <GraduationCap className="size-6" />
            <span>Administration</span>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-black hover:bg-secondary"
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-3">
          <Link
            to="/"
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            ← Retour au site public
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="text-sm text-muted-foreground">
            Connecté en tant que{" "}
            <span className="font-medium text-foreground">{user?.nom}</span>{" "}
            <span className="rounded bg-secondary px-2 py-0.5 text-xs">
              {user?.role}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
