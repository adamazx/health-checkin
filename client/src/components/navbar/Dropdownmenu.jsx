import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Dropdownmenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const itemsRef = useRef([]); // เก็บ ref ของ focusable items
  const toggleBtnRef = useRef(null);
  const toggleLock = useRef(false); // กัน double-toggle

  // ซิงค์ user จาก localStorage ข้ามแท็บ
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

  // ปิดเมนูเมื่อเปลี่ยนเส้นทาง
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // คลิกนอกกล่อง = ปิดเมนู
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen]);

  // เปิดเมนูแล้วโฟกัสไอเท็มแรก
  useEffect(() => {
    if (isOpen) {
      // หา focusable ทั้งหมดในเมนู
      const focusables = rootRef.current?.querySelectorAll(
        '[data-menu-item="true"]'
      );
      itemsRef.current = focusables ? Array.from(focusables) : [];
      itemsRef.current[0]?.focus();
    } else {
      // ปิดแล้วโฟกัสกลับปุ่ม
      toggleBtnRef.current?.focus();
    }
  }, [isOpen]);

  // คีย์บอร์ดในเมนู
  const onMenuKeyDown = (e) => {
    if (!isOpen) return;
    const list = itemsRef.current;
    const idx = list.findIndex((el) => el === document.activeElement);

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = list[(idx + 1) % list.length] || list[0];
      next?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev =
        list[(idx - 1 + list.length) % list.length] || list[list.length - 1];
      prev?.focus();
    }
    if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
    }
    if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
    navigate("/login");
  }, [navigate]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const toggleMenu = () => {
    // กัน double toggle จาก pointer+keyboard ในบางอุปกรณ์
    if (toggleLock.current) return;
    toggleLock.current = true;
    setIsOpen((o) => !o);
    setTimeout(() => (toggleLock.current = false), 100);
  };

  return (
    <div
      className="md:hidden relative z-50"
      ref={rootRef}
      onKeyDown={onMenuKeyDown}
    >
      {/* Hamburger Button */}
      <button
        ref={toggleBtnRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 17 14"
          aria-hidden="true"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800"
          role="menu"
        >
          <ul className="flex flex-col p-2 space-y-2">
            <li>
              <Link
                to="/"
                onClick={closeMenu}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 rounded"
                data-menu-item="true"
                role="menuitem"
                tabIndex={0}
              >
                การให้บริการ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={closeMenu}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 rounded"
                data-menu-item="true"
                role="menuitem"
                tabIndex={0}
              >
                ความรู้เพิ่มเติม
              </Link>
            </li>

            {!user ? (
              <>
                <li>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 rounded"
                    data-menu-item="true"
                    role="menuitem"
                    tabIndex={0}
                  >
                    ลงทะเบียน
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 rounded"
                    data-menu-item="true"
                    role="menuitem"
                    tabIndex={0}
                  >
                    เข้าสู่ระบบ
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-900 font-semibold hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 rounded"
                    data-menu-item="true"
                    role="menuitem"
                    tabIndex={0}
                  >
                    {user.name || user.username}
                  </Link>
                </li>
                <li>
                  <div className="inline-flex items-center px-2">
                    <NotificationBell />
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-800 dark:text-white dark:hover:bg-gray-600 font-semibold rounded"
                    data-menu-item="true"
                    role="menuitem"
                  >
                    ออกจากระบบ
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdownmenu;
