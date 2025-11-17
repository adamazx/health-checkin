import { useNavigate } from "react-router-dom";

const AdminMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      navigate("/admin");
    }
  };

  return (
    <div className="flex items-center space-x-4 md:space-x-6">
      <button
        onClick={handleLogout}
        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-base px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        ออกจากระบบ
      </button>
    </div>
  );
};

export default AdminMenu;
