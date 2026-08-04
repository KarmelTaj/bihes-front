import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../auth/useAuth";

/**
 * Gate for routes that need a signed-in user.
 *
 * Waits for the session restore to finish before deciding, otherwise a reload
 * would bounce an authenticated user to the login page. The attempted location
 * rides along so Login can send them back afterwards.
 */
export default function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="route-loading">Loading…</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
