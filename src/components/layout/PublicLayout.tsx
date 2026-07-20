import { useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GraduationCap, FileText, LayoutGrid, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/motion";
import { pageTransition } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { to: "/", label: "Accueil", icon: LayoutGrid, end: true },
  { to: "/epreuves", label: "Épreuves", icon: FileText, end: false },
];

const LOGO_CLICK_WINDOW_MS = 500;

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
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();
  const logoClicksRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = () => setMenuOpen(false);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    logoClicksRef.current += 1;

    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    if (logoClicksRef.current >= 3) {
      e.preventDefault();
      logoClicksRef.current = 0;
      closeMenu();
      navigate(isAuthenticated ? "/admin" : "/admin/login");
      return;
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClicksRef.current = 0;
    }, LOGO_CLICK_WINDOW_MS);

    closeMenu();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <motion.header
        initial={reduceMotion ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={pageTransition}
        className="fixed inset-x-4 z-40 top-6 mx-auto h-16 max-w-(--breakpoint-xl) rounded-full border bg-background shadow-sm"
      >
        <div className="mx-auto flex h-full items-center justify-between px-4">
          {/* Logo — triple-clic ouvre la connexion / le panneau admin */}
          <Link
            to="/"
            className="flex min-w-0 shrink items-center gap-2 font-semibold"
            onClick={handleLogoClick}
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <motion.footer
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={pageTransition}
        className="border-t border-primary/10 py-6 text-center text-sm text-muted-foreground sm:py-8"
      >
        <p className="px-4">
          Plateforme de consultation des épreuves d'examens · Université
        </p>
      </motion.footer>
    </div>
  );
}
