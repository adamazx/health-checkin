import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layouts/Layout";
import Home from "@/pages/Home";
import About from "@/pages/user/About";
import Profile from "@/pages/user/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Notfound from "@/pages/Notfound";

// User
import Selectservice from "@/pages/user/Selectservice";
import Selectdatetime from "@/pages/user/Selectdatetime";
import Userfrom from "@/pages/user/Userfrom";
import Summary from "@/pages/user/Summary";
import Selectsuccess from "@/pages/user/Selectsuccess";
import AppointmentSlip from "@/pages/user/AppointmentSlip";
import SlipLayout from "@/layouts/SlipLayout";
import NotificationsPage from "@/pages/user/NotificationsPage";

// Admin
import Admin from "@/pages/admin/Adminpage";
import AdminLogin from "@/pages/admin/AdminLogin";
import ManageService from "@/pages/admin/ManageService";
import ManageUser from "@/pages/admin/ManageUser";
import AdminAppointment from "@/pages/admin/AdminAppointment";
import AdminLayout from "@/layouts/AdminLayout";
import RequireAdminAuth from "@/components/requireadmin/RequireAdminAuth";
import AdminDashboard from "@/pages/admin/AdminDashboard";
// import AdminDashboardWithTabs from "@/components/dashboardcomponents/AdminDashboardWithTabs";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Select Routes */}
          <Route path="Selectservice" element={<Selectservice />} />
          <Route path="Selectdatetime" element={<Selectdatetime />} />
          <Route path="Userfrom" element={<Userfrom />} />
          <Route path="Summary" element={<Summary />} />
          <Route path="Selectsuccess" element={<Selectsuccess />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="/Appointment-Slip" element={<SlipLayout />}>
          <Route path="/Appointment-Slip" element={<AppointmentSlip />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<RequireAdminAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="main" element={<AdminDashboard />} />
            <Route path="manageservice" element={<ManageService />} />
            <Route path="manageuser" element={<ManageUser />} />
            <Route path="AdminAppointment" element={<AdminAppointment />} />
          </Route>
        </Route>

        {/* Select Routes */}
        <Route path="Selectservice" element={<Selectservice />} />

        {/* 404 fallback */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
