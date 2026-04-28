import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

/**
 * Route guard that redirects unauthenticated users to the home page.
 * Optionally restricts access to admin users only.
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show spinner while session is being restored
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    // Preserve the intended destination so we can redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
