import { Link } from "react-router-dom";

const Slipnav = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center space-x-4">
            <img src="/logo.png" className="h-8" alt="Logo" />
            <span className="text-xl font-semibold dark:text-white">
              Health Check-In
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Slipnav;
