import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex items-center space-x-10">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-4">
        <img src="/logo.png" className="h-8" alt="Health Check-In Logo" />
        <span className="text-xl font-semibold dark:text-white">
          Health Check-In
        </span>
      </Link>

      {/* Menu Left */}
      <nav aria-label="Main menu" className="hidden md:flex space-x-8">
        <Link
          to="/risk"
          className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
        >
          {/* การประเมินความเสี่ยง */}
        </Link>
        <Link
          to="/about"
          className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
        >
          {/* ความรู้เพิ่มเติม */}
        </Link>
      </nav>
    </div>
  );
};

export default Logo;
