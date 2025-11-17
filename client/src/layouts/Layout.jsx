import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-6">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;