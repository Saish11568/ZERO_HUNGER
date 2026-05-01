import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0]">
        <div className="text-xl font-semibold text-[#0D7377]">Loading...</div>
      </div>
    );
  }

  // Redirect to login only if there is no user authenticated
  // We use the replace prop to prevent the user from navigating back to the protected route
  // We also pass the current location to state so we can redirect them back after login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
