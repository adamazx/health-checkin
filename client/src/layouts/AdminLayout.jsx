import AdminNavbar from "@/components/adminnavbar/AdminNavbar";
import { Outlet } from "react-router-dom";

const adminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="pt-20 px-6">
        <Outlet />
      </main>
    </>
  );
};
export default adminLayout;
