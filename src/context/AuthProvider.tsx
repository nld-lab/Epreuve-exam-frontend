import { useCallback, useEffect, useState } from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { ApiSuccess, AuthUser } from "@/types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session si un token existe deja.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get<ApiSuccess<{ user: AuthUser }>>("/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => setToken(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<ApiSuccess<{ token: string; user: AuthUser }>>(
      "/auth/login",
      { email, password }
    );
    setToken(res.data.data.token);
    setUser(res.data.data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === "SUPERADMIN",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
