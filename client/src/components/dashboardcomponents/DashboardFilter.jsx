import { Link } from "react-router-dom";
import { useRef } from "react";
import CompactTable from "@/components/common/CompactTable";
import { statusLabel, statusClass, genderLabels } from "@/utils/constants";
import { fmtTH, ageYears } from "@/utils/format";

const DashboardFilter = ({
  keyword,
  setKeyword,
  statusFilter,
  setStatusFilter,
  selectedServiceId,
  setSelectedServiceId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  services,
  filteredAppointments,
}) => {
  const printRef = useRef();

  const handlePrint = () => {
  const conditions = `
    <div>
      <h2>เงื่อนไขการค้นหา</h2>
      <ul>
        <li><b>คำค้นหา:</b> ${keyword || "—"}</li>
        <li><b>สถานะ:</b> ${statusLabel[statusFilter] || "ทั้งหมด"}</li>
        <li><b>บริการ:</b> ${
          selectedServiceId === "ALL"
            ? "ทุกบริการ"
            : services.find((s) => String(s.id) === String(selectedServiceId))?.name || "—"
        }</li>
        <li><b>ช่วงเวลา:</b> ${
          startDate && endDate
            ? `${fmtTH(startDate)} ถึง ${fmtTH(endDate)}`
            : startDate
            ? `ตั้งแต่ ${fmtTH(startDate)}`
            : endDate
            ? `ถึง ${fmtTH(endDate)}`
            : "—"
        }</li>
      </ul>
    </div>
  `;

  const printContent = printRef.current.innerHTML;
  const newWindow = window.open("", "_blank");
  newWindow.document.write(`
    <html>
      <head>
        <title>รายงานนัดหมาย</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 14px; }
          th { background: #f5f5f5; }
          h2 { margin-bottom: 10px; }
          ul { margin: 0; padding: 0 0 0 18px; font-size: 14px; }
          li { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <h1>รายงานนัดหมาย</h1>
        ${conditions}
        ${printContent}
      </body>
    </html>
  `);
  newWindow.document.close();
  newWindow.print();
};


  return (
    <div className="flex flex-col gap-4">
      {/* 🔎 ส่วนกรอง */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col lg:flex-row flex-wrap gap-3">
          {/* ค้นหา */}
          <input
            type="text"
            placeholder="ค้นหานัดหมาย: ชื่อ/อีเมล/บริการ"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {/* กรองตามสถานะ */}
          <select
            className="w-full sm:w-40 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {Object.entries(statusLabel).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          {/* กรองตามบริการ */}
          <select
            className="w-full sm:w-52 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
          >
            <option value="ALL">ทุกบริการ</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* กรองตาม "ช่วงเวลา" */}
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="date"
              className="rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="self-center text-gray-600">ถึง</span>
            <input
              type="date"
              className="rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 📋 ตาราง */}
      <section ref={printRef} className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            รายการนัดหมาย
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              ทั้งหมด {filteredAppointments?.length || 0} รายการ
            </span>
            <Link
              to="/admin/dashboard/AdminAppointment"
              className="rounded-lg border border-gray-300 dark:border-gray-600 
                         px-3 py-1.5 text-sm font-semibold"
            >
              จัดการการนัด
            </Link>
            {/* 🖨 ปุ่มพิมพ์ */}
            <button
              onClick={handlePrint}
              className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm font-semibold hover:bg-blue-700"
            >
              🖨 พิมพ์รายงาน
            </button>
          </div>
        </div>

        <CompactTable
          columns={[
            {
              key: "user",
              label: "ผู้ใช้",
              render: (r) => (
                <div>
                  <div className="font-medium">
                    {r.user ? `${r.user.firstName} ${r.user.lastName}` : "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.user?.email || r.user?.username || "-"}
                  </div>
                </div>
              ),
            },
            { key: "phone", label: "เบอร์โทร", render: (r) => r.user?.phone || "-" },
            { key: "gender", label: "เพศ", render: (r) => genderLabels[r.user?.gender] || "ไม่ระบุ" },
            { key: "age", label: "อายุ", render: (r) => (r.user?.birthDate ? ageYears(r.user.birthDate) : "-") },
            {
              key: "services",
              label: "บริการ",
              render: (r) =>
                (r.appointments || [])
                  .map((x) => x.service?.name)
                  .filter(Boolean)
                  .join(", ") || "-",
            },
            { key: "appointmentDate", label: "วัน-เวลา", render: (r) => (r.appointmentDate ? fmtTH(r.appointmentDate) : "-") },
            {
              key: "status",
              label: "สถานะ",
              render: (r) => (
                <span className={`inline-block text-xs px-2 py-1 rounded border ${statusClass[r.status]}`}>
                  {statusLabel[r.status]}
                </span>
              ),
            },
          ]}
          rows={filteredAppointments}
          emptyText="ยังไม่มีรายการ"
        />
      </section>
    </div>
  );
};

export default DashboardFilter;
