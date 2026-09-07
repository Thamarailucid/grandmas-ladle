import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/stores/authStore';

interface PublicRouteProps {
  children?: React.ReactNode;
}

/**
 * PublicRoute (also aliased as PublicOnlyRoute / GuestRoute):
 * Route guard for public-only pages like /login.
 * If an already authenticated user accesses /login or clicks the browser Back button,
 * they are immediately redirected to the dashboard (or their intended destination) with replace: true.
 * This guarantees an authenticated user will NEVER see the login screen.
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();

  if (isAuthenticated()) {
    const destination = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : null;
}

export const PublicOnlyRoute = PublicRoute;
export default PublicRoute;
