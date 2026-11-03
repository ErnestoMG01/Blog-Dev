import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const authenticated = sessionStorage.getItem("cms_admin_authenticated") === "true"
    && Boolean(sessionStorage.getItem("cms_admin_api_key"));

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
