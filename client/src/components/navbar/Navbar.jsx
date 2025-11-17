import { useEffect, useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import Dropdownmenu from "./Dropdownmenu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-3 focus:py-2 focus:rounded"
      >
        ข้ามไปยังเนื้อหา
      </a>

      <nav
        className={[
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm",
          "fixed w-full z-50 border-b border-gray-200 dark:border-gray-700",
          scrolled ? "shadow-sm" : "shadow-none",
        ].join(" ")}
        role="navigation"
        aria-label="ส่วนหัวเว็บไซต์"
      >
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-5">
          <div className="flex items-center justify-between gap-4">
            <Logo />

            <div className="flex items-center gap-4">
              <Menu />
              <Dropdownmenu />
            </div>
          </div>
        </div>
      </nav>

      <div aria-hidden="true" className="h-16 md:h-[76px]" />
    </>
  );
};

export default Navbar;
