import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Toggle variant="outline" size="sm" aria-label="Changer le thème" disabled>
        <Sun className="size-4" />
      </Toggle>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Toggle
      variant="outline"
      size="sm"
      pressed={isDark}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Toggle>
  );
}
