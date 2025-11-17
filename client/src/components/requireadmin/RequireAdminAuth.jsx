import { Navigate, Outlet } from "react-router-dom";

const RequireAdminAuth = () => {
  const admin = localStorage.getItem("admin");
  const token = localStorage.getItem("token");

  if (!token || !admin) {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
};

export default RequireAdminAuth;
