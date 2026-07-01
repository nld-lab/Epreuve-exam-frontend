import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { GraduationCap, FileText, LayoutGrid, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { to: "/", label: "Accueil", icon: LayoutGrid, end: true },
  { to: "/epreuves", label: "Épreuves", icon: FileText, end: false },
];

function navLinkClass(isActive: boolean, mobile = false) {
  return cn(
    "flex items-center gap-2 rounded-md font-medium transition-colors",
    mobile ? "px-3 py-3 text-base" : "px-3 py-2 text-sm",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
  );
}

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:h-16 md:px-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex min-w-0 shrink items-center gap-2 font-semibold"
            onClick={closeMenu}
          >
            <GraduationCap className="size-6 shrink-0 text-primary" />
            <span className="truncate sm:hidden">Examens</span>
            <span className="hidden truncate sm:inline">
              Épreuves<span className="text-primary"> d'Examens</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              className="ml-2 rounded-md border border-primary/20 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Administration
            </Link>
            <ThemeToggle />
          </nav>

          {/* Actions mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="border-primary/20"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw-2rem,320px)] p-0">
                <SheetHeader className="border-b border-primary/10 px-4 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5 text-primary" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-3">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeMenu}
                      className={({ isActive }) => navLinkClass(isActive, true)}
                    >
                      <item.icon className="size-5 shrink-0" />
                      {item.label}
                    </NavLink>
                  ))}
                  <Link
                    to="/admin/login"
                    onClick={closeMenu}
                    className="mt-2 flex items-center justify-center rounded-md border border-primary/20 px-3 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/5"
                  >
                    Administration
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 md:px-30">
        <Outlet />
      </main>

      <footer className="border-t border-primary/10 py-6 text-center text-sm text-muted-foreground sm:py-8">
        <p className="px-4">
          Plateforme de consultation des épreuves d'examens · Université
        </p>
      </footer>
    </div>
  );
}
