import Slipnav from "@/components/profile/Slipnav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Slipnav />
      <main className="pt-20 px-6">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;