import { Link } from "react-router-dom";

import KpiCard from "@/components/common/KpiCard";
import ChartCard from "@/components/common/ChartCard";
import CustomTooltip from "@/components/common/CustomTooltip";
import CompactTable from "@/components/common/CompactTable";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  statusLabel,
  statusClass,
  STATUS_COLOR,
  SERVICE_COLORS,
  relationshipLabel,
} from "@/utils/constants";

const DashboardHeader = ({
  fetchAll,
  err,
  loading,
  totalUsers,
  totalServices,
  totalAppointments,
  statusCount,
  statusChartData,
  groupedStatusData,
  monthlyChartData,
  serviceChartData,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            แดชบอร์ดระบบ
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            ภาพรวมข้อมูลผู้ใช้งาน บริการ และการนัดหมาย
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAll}
            className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
          >
            โหลดข้อมูลใหม่
          </button>
          <button
            onClick={() => window.print()}
            className="print:hidden rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            พิมพ์รายงาน
          </button>
        </div>
      </header>

      {/* Error / Loading */}
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}
      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 p-4 text-gray-600 dark:text-gray-200">
          กำลังโหลดข้อมูล…
        </div>
      )}

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="ผู้ใช้งานทั้งหมด" value={totalUsers} />
        <KpiCard label="บริการทั้งหมด" value={totalServices} />
        <KpiCard
          label="การจองทั้งหมด"
          value={totalAppointments}
          sub={`ยืนยันแล้ว ${statusCount.CONFIRMED || 0} รายการ`}
        />
        <KpiCard
          label="รอดำเนินการ"
          value={statusCount.PENDING || 0}
          sub={`เสร็จสิ้น ${statusCount.COMPLETED || 0} / ยกเลิก ${
            statusCount.CANCELED || 0
          }`}
        />
      </section>

      {/* Charts */}
      {/* ===== สรุปรายการ (กราฟ) ===== */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* 1) กราฟแท่ง: จำนวนการนัดตามสถานะ */}
        <ChartCard
          title="จำนวนการนัดตามสถานะ"
          subtitle={`ทั้งหมด ${statusChartData.reduce(
            (s, x) => s + x.value,
            0
          )} รายการ`}
          isEmpty={!statusChartData.some((d) => d.value > 0)}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={groupedStatusData}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />

              <Bar
                dataKey="PENDING"
                name={statusLabel.PENDING}
                fill={STATUS_COLOR.PENDING}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="CONFIRMED"
                name={statusLabel.CONFIRMED}
                fill={STATUS_COLOR.CONFIRMED}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="COMPLETED"
                name={statusLabel.COMPLETED}
                fill={STATUS_COLOR.COMPLETED}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="CANCELED"
                name={statusLabel.CANCELED}
                fill={STATUS_COLOR.CANCELED}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2) กราฟเส้น: จำนวนการนัดรายเดือน */}
        <ChartCard
          title="จำนวนการนัดรายเดือน"
          subtitle={
            monthlyChartData.length
              ? `ช่วง ${monthlyChartData[0]?.month} - ${
                  monthlyChartData.at(-1)?.month
                }`
              : "—"
          }
          isEmpty={!monthlyChartData.some((d) => d.count > 0)}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={monthlyChartData}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                content={
                  <CustomTooltip
                    labelKey="month"
                    valueKey="count"
                    valueLabel="จำนวน"
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="จำนวน"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3) กราฟวงกลม: สัดส่วนการจองตามบริการ */}
        <ChartCard
          title="สัดส่วนการจองตามบริการ"
          subtitle={`รวม ${serviceChartData.reduce(
            (s, x) => s + x.value,
            0
          )} ครั้ง`}
          isEmpty={!serviceChartData.some((d) => d.value > 0)}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip content={<CustomTooltip valueLabel="ครั้ง" />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
                iconSize={10}
              />
              <Pie
                data={serviceChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={90}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                strokeWidth={1}
              >
                {serviceChartData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={SERVICE_COLORS[idx % SERVICE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
};
export default DashboardHeader;
