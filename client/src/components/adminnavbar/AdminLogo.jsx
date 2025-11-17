import { Link } from "react-router-dom";

const AdminLogo = () => {
  return (
    <div className="flex items-center space-x-10">
      <Link to="/admin/dashboard" className="flex items-center space-x-4">
        <img src="/logo.png" className="h-8" alt="Logo" />
        <span className="text-xl font-semibold dark:text-white">
          Admin Dashboard
        </span>
      </Link>

      {/* Admin Menu Left */}
      <ul className="hidden md:flex space-x-8">
        <li>
          <Link
            to="/admin/dashboard/main"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            แดชบอร์ด
          </Link>
        </li>
        <li>
          <Link
            to="/admin/dashboard/manageuser"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            จัดการผู้ใช้
          </Link>
        </li>
        <li>
          <Link
            to="/admin/dashboard/manageservice"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            จัดการบริการ
          </Link>
        </li>
                <li>
          <Link
            to="/admin/dashboard/AdminAppointment"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            จัดการการนัด
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminLogo;
