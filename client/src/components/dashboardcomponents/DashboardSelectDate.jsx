import { Link } from "react-router-dom";

import { statusLabel, statusClass } from "@/utils/constants";
import KpiCard from "@/components/common/KpiCard";
import ChartCard from "@/components/common/ChartCard";
import CustomTooltip from "@/components/common/CustomTooltip";
import CompactTable from "@/components/common/CompactTable";

const DashboardSelectDate = ({
  selectedDate,
  setSelectedDate,
  appointmentsOnSelectedDate,
  statusClass,
  statusLabel,
}) => {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          รายชื่อผู้ใช้งานที่มีนัดในวันที่เลือก
        </h3>
        <input
          type="date"
          className="sm:ml-auto w-full sm:w-56 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        พบ {appointmentsOnSelectedDate?.length || 0} รายการนัด
      </p>

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
              </div>
            ),
          },
          {
            key: "email",
            label: "อีเมล",
            render: (r) => r.user?.email || r.user?.username || "-",
          },
          {
            key: "phone",
            label: "เบอร์โทร",
            render: (r) => r.user?.phone || "-",
          },
          {
            key: "services",
            label: "บริการ",
            render: (r) => (
              <div className="text-xs sm:text-sm">
                {(r.appointments || [])
                  .map((x) => x.service?.name)
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
            ),
          },
          {
            key: "appointmentDate",
            label: "เวลา",
            render: (r) =>
              r.appointmentDate
                ? new Intl.DateTimeFormat("th-TH", {
                    timeStyle: "short",
                    hour12: false,
                  }).format(new Date(r.appointmentDate))
                : "-",
          },
          {
            key: "status",
            label: "สถานะ",
            render: (r) => (
              <span
                className={`inline-block text-xs px-2 py-1 rounded border ${
                  statusClass[r.status]
                }`}
              >
                {statusLabel[r.status]}
              </span>
            ),
          },
        ]}
        rows={appointmentsOnSelectedDate}
        emptyText="ไม่มีนัดในวันนี้"
      />
    </section>
  );
};
export default DashboardSelectDate;
