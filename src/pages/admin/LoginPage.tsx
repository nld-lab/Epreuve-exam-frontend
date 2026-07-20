import { useEffect, useMemo, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getErrorMessage } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Reveal } from "@/components/motion";

const LOGIN_LOCK_STORAGE_KEY = "epreuves.loginLockUntil";

function getStoredLockUntil(): number | null {
  const rawValue = localStorage.getItem(LOGIN_LOCK_STORAGE_KEY);
  if (!rawValue) return null;

  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue) || parsedValue <= Date.now()) {
    localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
    return null;
  }

  return parsedValue;
}

function formatRemainingTime(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes} min ${seconds.toString().padStart(2, "0")}s`;
}

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lockUntil, setLockUntil] = useState<number | null>(() => getStoredLockUntil());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!lockUntil) return;

    const intervalId = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (currentTime >= lockUntil) {
        localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
        setLockUntil(null);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [lockUntil]);

  const remainingLockMs = useMemo(() => {
    if (!lockUntil) return 0;
    return Math.max(0, lockUntil - now);
  }, [lockUntil, now]);

  const isLocked = remainingLockMs > 0;

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setSubmitting(true);
    try {
      await login(email, password);
      localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
      setLockUntil(null);
      toast.success("Connexion réussie");
      navigate("/admin", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        const retryAfterHeader = err.response.headers["retry-after"];
        const retryAfterSeconds = Number(retryAfterHeader);
        const nextLockUntil =
          Date.now() +
          (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
            ? retryAfterSeconds * 1000
            : 15 * 60 * 1000);

        localStorage.setItem(LOGIN_LOCK_STORAGE_KEY, String(nextLockUntil));
        setNow(Date.now());
        setLockUntil(nextLockUntil);
      }
      toast.error(getErrorMessage(err, "Échec de la connexion"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-foreground/10 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Reveal className="w-full max-w-sm" inView={false} direction="scale">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Espace administration</CardTitle>
          <CardDescription>
            Connectez-vous pour gérer les épreuves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLocked && (
              <Alert variant="destructive">
                <AlertDescription>
                  Le formulaire est temporairement verrouille apres 5 tentatives incorrectes.
                  Reessayez dans {formatRemainingTime(remainingLockMs)}.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLocked || submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLocked || submitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || isLocked}>
              {submitting && <Spinner className="size-4" />}
              {isLocked ? "Connexion verrouillee" : "Se connecter"}
            </Button>
          </form>
          <div className="mt-4 text-center justify-center flex">
            <Link to="/" className="text-sm  hover:underline flex items-center">
              <ArrowLeft className="size-4 mr-2" /> Retour au site public
            </Link>
          </div>
        </CardContent>
      </Card>
      </Reveal>
    </div>
  );
}
