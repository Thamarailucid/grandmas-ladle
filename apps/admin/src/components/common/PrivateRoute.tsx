import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/stores/authStore';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

/**
 * PrivateRoute (also aliased as ProtectedRoute):
 * Route guard that protects dashboard and admin-only pages.
 * If a user is not authenticated, they are blocked and redirected to /login with replace: true,
 * preserving the attempted location in navigation state so they can be returned after login.
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
}

export const ProtectedRoute = PrivateRoute;
export default PrivateRoute;
