import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export default function ProtectedRoute() {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
