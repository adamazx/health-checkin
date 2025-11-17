import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Menu = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          setUser(JSON.parse(e.newValue || "null"));
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    // กล่องหลัก: จัดแนวกลางแนวดิ่ง + เว้นระยะด้วย gap
    <div className="flex items-center gap-3 md:gap-6">
      {/* กลุ่มลิงก์ด้านขวา (ซ่อนบนจอเล็ก) */}
      <ul className="hidden md:flex items-center gap-8">
        {!user ? (
          <>
            <li className="align-middle">
              <Link
                to="/register"
                className="align-middle text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
              >
                ลงทะเบียน
              </Link>
            </li>
            <li className="align-middle">
              <Link
                to="/login"
                className="align-middle text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
              >
                เข้าสู่ระบบ
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="align-middle">
              <Link
                to="/profile"
                className="align-middle text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500 whitespace-nowrap"
                title={user.name || user.username}
              >
                ยินดีต้อนรับ, {user.name || user.username}
              </Link>
            </li>
            {/* ทำให้กระดิ่งจัดกึ่งกลางแนวดิ่ง */}
            <li className="align-middle">
              <div className="inline-flex items-center">
                <NotificationBell />
              </div>
            </li>
            <li className="align-middle">
              <button
                onClick={handleLogout}
                className="align-middle text-red-600 hover:text-red-800 font-semibold"
              >
                ออกจากระบบ
              </button>
            </li>
          </>
        )}
      </ul>

      {/* ปุ่มนัดหมายให้สูงเท่ากันเสมอ (h-10) และจัดกลางด้วย inline-flex */}
      <Link
        to="/Selectservice"
        className="shrink-0 inline-flex h-10 items-center justify-center rounded-lg px-4 text-base font-bold
                   text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
                   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        นัดหมาย
      </Link>
    </div>
  );
};

export default Menu;
