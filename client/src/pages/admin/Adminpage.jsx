import { Link } from "react-router-dom";

const adminMenus = [
  {
    label: "ภาพรวมระบบ (Dashboard)",
    path: "/admin/dashboard/main",
    description: "ดูสรุปผู้ใช้งาน บริการ และการจองนัดหมายทั้งหมด",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    label: "จัดการข้อมูลผู้ใช้งาน",
    path: "/admin/dashboard/manageuser",
    description: "จัดการข้อมูลของผู้ใช้งานทั้งหมด",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    label: "จัดการบริการตรวจสุขภาพ",
    path: "/admin/dashboard/manageservice",
    description: "ตั้งค่าบริการตรวจสุขภาพ",
    accent: "from-amber-500 to-orange-500",
  },
  {
    label: "จัดการการนัด",
    path: "/admin/dashboard/AdminAppointment",
    description: "ตรวจสอบและเปลี่ยนสถานะการนัดหมายของผู้ใช้งาน",
    accent: "from-rose-500 to-pink-500",
  },
];

const Adminpage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              แดชบอร์ดผู้ดูแลระบบ
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              จัดการข้อมูลผู้ใช้งาน บริการ และการนัดหมายทั้งหมด
            </p>
          </div>

          {/* ✅ ปุ่มไปหน้า Dashboard ภาพรวมอย่างชัดเจน */}
          <Link
            to="/admin/dashboard/main"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="ไปหน้า Dashboard ภาพรวม"
          >
            {/* ไอคอน Chart */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3a1 1 0 0 0-1 1v16h2V5h16V3H3Zm3 6v10h2V9H6Zm4-4v14h2V5h-2Zm4 6v8h2v-8h-2Zm4-3v11h2V8h-2Z" />
            </svg>
            ไปหน้า Dashboard
          </Link>
        </header>

        {/* เมนูหลัก */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenus.map((menu, index) => (
            <Link
              to={menu.path}
              key={index}
              className="group relative block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={menu.label}
            >
              {/* แถบไล่สีด้านบนเพื่อแยกประเภทเมนู */}
              <div
                className={`h-1 bg-gradient-to-r ${menu.accent || "from-blue-500 to-indigo-500"}`}
              />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  {/* ไอคอนเอนกประสงค์ */}
                  <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700 dark:text-gray-200"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M4 4h16v2H4V4Zm0 4h10v2H4V8Zm0 4h16v2H4v-2Zm0 4h10v2H4v-2Z" />
                    </svg>
                  </div>

                  <h2 className="text-lg text-blue-700 dark:text-blue-300 font-bold">
                    {menu.label}
                  </h2>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {menu.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition">
                  ไปที่หน้า {menu.label.replace(/\(.*\)/, "").trim()} 
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.172 12 8.222 7.05l1.415-1.414L16 12l-6.363 6.364-1.415-1.415L13.172 12Z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Adminpage;
