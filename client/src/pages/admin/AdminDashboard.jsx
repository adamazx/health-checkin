import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import DashboardHeader from "@/components/dashboardcomponents/DashboardHeader";
import DashboardFilter from "@/components/dashboardcomponents/DashboardFilter";
import DashboardSelectDate from "@/components/dashboardcomponents/DashboardSelectDate";
import DashboardUser_Services from "@/components/dashboardcomponents/DashboardUser_Services";

import { statusLabel, statusClass, relationshipLabel } from "@/utils/constants";
import { fmtTH, fmtTHDateOnly, ageYears } from "@/utils/format";

const API_BASE = "http://localhost:5000";

export default function AdminDashboard({ useTabs = true }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedServiceId, setSelectedServiceId] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  });

  // โหลดข้อมูล
  const fetchAll = async () => {
    try {
      setLoading(true);
      setErr("");
      const [u, s, a] = await Promise.all([
        axios.get(`${API_BASE}/api/users`),
        axios.get(`${API_BASE}/api/services`),
        axios.get(`${API_BASE}/api/appointments`),
      ]);
      setUsers(Array.isArray(u.data) ? u.data : []);
      setServices(Array.isArray(s.data) ? s.data : []);
      setAppointments(Array.isArray(a.data) ? a.data : []);
    } catch (e) {
      console.error(e);
      setErr("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // KPI + Data processing
  const totalUsers = users.length;
  const totalServices = services.length;
  const totalAppointments = appointments.length;

  const statusCount = useMemo(() => {
    const map = { PENDING: 0, CONFIRMED: 0, CANCELED: 0, COMPLETED: 0 };
    for (const a of appointments) {
      if (map[a.status] != null) map[a.status]++;
    }
    return map;
  }, [appointments]);

  const statusChartData = useMemo(
    () => [
      { key: "PENDING", name: "รอดำเนินการ", value: statusCount.PENDING || 0 },
      {
        key: "CONFIRMED",
        name: "ยืนยันแล้ว",
        value: statusCount.CONFIRMED || 0,
      },
      {
        key: "COMPLETED",
        name: "เสร็จสมบูรณ์",
        value: statusCount.COMPLETED || 0,
      },
      { key: "CANCELED", name: "ยกเลิกแล้ว", value: statusCount.CANCELED || 0 },
    ],
    [statusCount]
  );

  const groupedStatusData = useMemo(
    () => [
      {
        name: "จำนวนการนัด",
        PENDING: statusCount.PENDING || 0,
        CONFIRMED: statusCount.CONFIRMED || 0,
        COMPLETED: statusCount.COMPLETED || 0,
        CANCELED: statusCount.CANCELED || 0,
      },
    ],
    [statusCount]
  );

  const monthlyChartData = useMemo(() => {
    const map = new Map();
    for (const a of appointments) {
      if (!a?.appointmentDate) continue;
      const d = new Date(a.appointmentDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [appointments]);

  const serviceChartData = useMemo(() => {
    const map = new Map();
    for (const a of appointments) {
      for (const s of a.appointments || []) {
        const name = s.service?.name || "ไม่ทราบ";
        map.set(name, (map.get(name) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    // กรองสถานะ
    if (statusFilter !== "ALL") {
      list = list.filter((a) => a.status === statusFilter);
    }

    // กรอง keyword
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter((a) => {
        const u = a.user || {};
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`
          .trim()
          .toLowerCase();
        const uname = (u.username || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const serviceNames = (a.appointments || [])
          .map((x) => (x.service?.name || "").toLowerCase())
          .join(" ");
        return (
          fullName.includes(kw) ||
          uname.includes(kw) ||
          email.includes(kw) ||
          serviceNames.includes(kw)
        );
      });
    }

    // กรองบริการ
    if (selectedServiceId !== "ALL") {
      list = list.filter((a) =>
        (a.appointments || []).some((x) => x.serviceId === selectedServiceId)
      );
    }

    // กรองช่วงเวลา
    if (startDate) {
      const start = new Date(startDate).getTime();
      list = list.filter((a) => new Date(a.appointmentDate).getTime() >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      list = list.filter((a) => new Date(a.appointmentDate).getTime() <= end);
    }

    // เรียงจากใหม่ → เก่า
    return list.sort(
      (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );
  }, [
    appointments,
    keyword,
    statusFilter,
    selectedServiceId,
    startDate,
    endDate,
  ]);

  const earliest5Appointments = useMemo(() => {
    const asc = [...filteredAppointments].sort(
      (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );
    return asc.slice(0, 5);
  }, [filteredAppointments]);

  const latestUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const latestServices = [...services]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 5);

  const appointmentsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const [y, m, d] = selectedDate.split("-").map((x) => parseInt(x, 10));
    if (!y || !m || !d) return [];
    const start = new Date(y, m - 1, d, 0, 0, 0, 0);
    const end = new Date(y, m - 1, d, 23, 59, 59, 999);
    return appointments
      .filter((a) => {
        const t = new Date(a.appointmentDate).getTime();
        return t >= start.getTime() && t <= end.getTime();
      })
      .sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
      );
  }, [appointments, selectedDate]);

  // -------- Tabs --------
  const [activeTab, setActiveTab] = useState("header");
  const tabs = [
    { key: "header", label: "แดชบอร์ดระบบ" },
    { key: "filter", label: "สรุปรายการนัดหมาย" },
    // { key: "selectedService", label: "รายการสรุปผู้ใช้ที่เลือกบริการ" },
    // { key: "selectDate", label: "รายชื่อผู้ใช้งานที่มีนัดในวันที่เลือก" },
    { key: "user_services", label: "ผู้ใช้งาน และบริการ" },
  ];

  // -------- Render --------
  if (useTabs) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-56 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            เมนูแดชบอร์ดระบบ
          </h2>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "header" && (
            <DashboardHeader
              fetchAll={fetchAll}
              err={err}
              loading={loading}
              totalUsers={totalUsers}
              totalServices={totalServices}
              totalAppointments={totalAppointments}
              statusCount={statusCount}
              statusChartData={statusChartData}
              groupedStatusData={groupedStatusData}
              monthlyChartData={monthlyChartData}
              serviceChartData={serviceChartData}
            />
          )}
          {activeTab === "filter" && (
            <DashboardFilter
              keyword={keyword}
              setKeyword={setKeyword}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedServiceId={selectedServiceId}
              setSelectedServiceId={setSelectedServiceId}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              services={services}
              filteredAppointments={filteredAppointments}
            />
          )}
          {activeTab === "user_services" && (
            <DashboardUser_Services
              users={users}
              services={services}
              latestUsers={latestUsers}
              latestServices={latestServices}
              relationshipLabel={relationshipLabel}
              fmtTHDateOnly={fmtTHDateOnly}
              ageYears={ageYears}
            />
          )}
        </main>
      </div>
    );
  }

  // -------- Default view (no tabs) --------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-screen-xl mx-auto px-4 space-y-8">
        <DashboardHeader
          fetchAll={fetchAll}
          err={err}
          loading={loading}
          totalUsers={totalUsers}
          totalServices={totalServices}
          totalAppointments={totalAppointments}
          statusCount={statusCount}
          statusChartData={statusChartData}
          groupedStatusData={groupedStatusData}
          monthlyChartData={monthlyChartData}
          serviceChartData={serviceChartData}
        />
        <DashboardFilter
          keyword={keyword}
          setKeyword={setKeyword}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={setSelectedServiceId}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          services={services}
          filteredAppointments={filteredAppointments}
          earliest5Appointments={earliest5Appointments}
        />
        <DashboardUser_Services
          users={users}
          services={services}
          latestUsers={latestUsers}
          latestServices={latestServices}
          relationshipLabel={relationshipLabel}
          fmtTHDateOnly={fmtTHDateOnly}
          ageYears={ageYears}
        />
      </div>
    </div>
  );
}
