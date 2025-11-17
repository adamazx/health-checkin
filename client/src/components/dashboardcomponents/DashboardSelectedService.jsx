import { Link } from "react-router-dom";

import { fmtTH } from "@/utils/format";
import KpiCard from "@/components/common/KpiCard";
import ChartCard from "@/components/common/ChartCard";
import CustomTooltip from "@/components/common/CustomTooltip";
import CompactTable from "@/components/common/CompactTable";

const DashboardSelectedService = ({
  selectedServiceId,
  setSelectedServiceId,
  services,
  usersOfSelectedService,
  fmtTH,
}) => {
  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          สรุปผู้ใช้ที่เลือกบริการ
        </h3>
        <select
          className="sm:ml-auto w-full sm:w-72 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
        >
          <option value="ALL">— เลือกบริการ —</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedServiceId !== "ALL" && (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            รวม {usersOfSelectedService?.length || 0} คน ที่เคยจองบริการนี้
          </p>

          <CompactTable
            columns={[
              {
                key: "name",
                label: "ชื่อ",
                render: (row) => {
                  const u = row.user;
                  return (
                    <div>
                      <div className="font-medium">
                        {u.firstName} {u.lastName}
                      </div>
                    </div>
                  );
                },
              },
              {
                key: "email",
                label: "อีเมล",
                render: (row) => row.user.email || `@${row.user.username}`,
              },
              {
                key: "phone",
                label: "เบอร์โทร",
                render: (row) => row.user.phone || "-",
              },
              {
                key: "apptDate",
                label: "วันที่นัดหมาย",
                render: (row) => (row.apptDate ? fmtTH(row.apptDate) : "-"),
              },
            ]}
            rows={usersOfSelectedService}
            emptyText="ยังไม่มีผู้ใช้ที่จองบริการนี้"
          />
        </>
      )}
    </section>
  );
};
export default DashboardSelectedService;
