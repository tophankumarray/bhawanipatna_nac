// @ts-nocheck
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) return null;

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
