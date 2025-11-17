import Logo from "./AdminLogo";
import Menu from "./AdminMenu";
import Dropdownmenu from "./AdminDropdownmenu";

const AdminNavbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap">
        
        {/* Left - Logo + เมนูซ้าย */}
        <Logo />
        
        {/* Right - เมนูขวา + ปุ่มนัดหมาย */}
        <Menu />
        
        {/* Hamburger button (optional) */}
        <Dropdownmenu />
      </div>
    </nav>
  );
};

export default AdminNavbar;
