import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { relationshipLabel, genderLabels } from "@/utils/constants";
import { fmtTHDateOnly, ageYears } from "@/utils/format";
import CompactTable from "@/components/common/CompactTable";

const DashboardUser_Services = ({
  users,
  services,
  relationshipLabel,
  fmtTHDateOnly,
  ageYears,
}) => {
  // ==== State Users ====
  const [userQuery, setUserQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  // ==== State Services ====
  const [serviceQuery, setServiceQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ==== Filter Users ====
  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      const phone = (u.phone || "").toLowerCase();

      if (
        userQuery &&
        !(
          fullName.includes(userQuery.toLowerCase()) ||
          email.includes(userQuery.toLowerCase()) ||
          phone.includes(userQuery.toLowerCase())
        )
      ) {
        return false;
      }

      if (genderFilter !== "ALL" && u.gender !== genderFilter) {
        return false;
      }

      if (u.birthDate) {
        const age = ageYears(u.birthDate);
        if (minAge && age < parseInt(minAge)) return false;
        if (maxAge && age > parseInt(maxAge)) return false;
      }

      return true;
    });
  }, [users, userQuery, genderFilter, minAge, maxAge]);

  // ==== Filter Services ====
  const filteredServices = useMemo(() => {
    return (services || []).filter((s) => {
      const name = (s.name || "").toLowerCase();

      if (serviceQuery && !name.includes(serviceQuery.toLowerCase())) {
        return false;
      }

      const price =
        s.priceType === "FREE"
          ? 0
          : typeof s.price === "number"
          ? s.price
          : null;

      if (price !== null) {
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
      }

      return true;
    });
  }, [services, serviceQuery, minPrice, maxPrice]);

  // ==== Print Users ====
  const handlePrintUsers = () => {
    const printContent = document.getElementById("users-report").innerHTML;
    const win = window.open("", "", "width=1000,height=800");
    win.document.write(`
      <html>
        <head>
          <title>รายงานผู้ใช้งาน</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>รายงานผู้ใช้งาน</h2>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <section className="space-y-8">
      {/* ==== Users ==== */}
      <div className="space-y-3" id="users-report">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ผู้ใช้งาน
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              ทั้งหมด {filteredUsers?.length || 0} คน
            </span>
            <Link
              to="/admin/dashboard/manageuser"
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              จัดการผู้ใช้งาน
            </Link>
            <button
              onClick={handlePrintUsers}
              className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm font-semibold hover:bg-blue-700"
            >
              พิมพ์รายงาน
            </button>
          </div>
        </div>

        {/* ฟิลเตอร์ Users */}
        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            placeholder="ค้นหา: ชื่อ/อีเมล/เบอร์"
            className="border rounded px-3 py-2 text-sm flex-1"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 text-sm"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="ALL">ทุกเพศ</option>
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
            <option value="UNSPECIFIED">ไม่ระบุ</option>
          </select>
          <input
            type="number"
            placeholder="อายุขั้นต่ำ"
            className="border rounded px-3 py-2 text-sm w-28"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
          />
          <input
            type="number"
            placeholder="อายุสูงสุด"
            className="border rounded px-3 py-2 text-sm w-28"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
          />
        </div>

        <CompactTable
          columns={[
            {
              key: "name",
              label: "ชื่อ",
              render: (u) => (
                <div>
                  <div className="font-medium">
                    {u.firstName} {u.lastName}
                  </div>
                </div>
              ),
            },
            { key: "email", label: "อีเมล" },
            { key: "phone", label: "เบอร์โทร" },
            {
              key: "gender",
              label: "เพศ",
              render: (u) => genderLabels[u.gender] || "ไม่ระบุ",
            },
            {
              key: "relationship",
              label: "สถานะ",
              render: (u) => relationshipLabel[u.relationship] || "-",
            },
            {
              key: "birthDate",
              label: "วันเกิด",
              render: (u) => (u.birthDate ? fmtTHDateOnly(u.birthDate) : "-"),
            },
            {
              key: "age",
              label: "อายุ(ปี)",
              render: (u) => ageYears(u.birthDate),
            },
          ]}
          rows={filteredUsers}
          emptyText="ยังไม่มีผู้ใช้"
        />
      </div>

      {/* ==== Services ==== */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            บริการ
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              ทั้งหมด {filteredServices?.length || 0} รายการ
            </span>
            <Link
              to="/admin/dashboard/manageservice"
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              เพิ่มบริการ
            </Link>
          </div>
        </div>

        {/* ฟิลเตอร์ Services */}
        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            placeholder="ค้นหาบริการ"
            className="border rounded px-3 py-2 text-sm flex-1"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
          />
          <input
            type="number"
            placeholder="ราคา ขั้นต่ำ"
            className="border rounded px-3 py-2 text-sm w-32"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="ราคา สูงสุด"
            className="border rounded px-3 py-2 text-sm w-32"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <CompactTable
          columns={[
            { key: "name", label: "ชื่อบริการ" },
            {
              key: "price",
              label: "ราคา",
              render: (s) =>
                s.priceType === "FREE"
                  ? "ฟรี"
                  : typeof s.price === "number"
                  ? `${s.price.toLocaleString()} บาท`
                  : "-",
            },
            {
              key: "duration",
              label: "ระยะเวลา (นาที)",
              render: (s) => s.duration ?? "-",
            },
          ]}
          rows={filteredServices}
          emptyText="ยังไม่มีบริการ"
        />
      </div>
    </section>
  );
};

export default DashboardUser_Services;
