import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  requireSuperAdmin?: boolean;
}

export function ProtectedRoute({ requireSuperAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isSuperAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
