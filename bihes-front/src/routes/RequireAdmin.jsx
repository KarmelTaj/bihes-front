import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../auth/useAuth";

export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="route-loading">Loading…</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
