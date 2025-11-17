import { useState } from "react";
import DashboardHeader from "@/components/dashboardcomponents/DashboardHeader";
import DashboardFilter from "@/components/dashboardcomponents/DashboardFilter";
import DashboardSelectedService from "@/components/dashboardcomponents/DashboardSelectedService";
import DashboardSelectDate from "@/components/dashboardcomponents/DashboardSelectDate";
import DashboardUser_Services from "@/components/dashboardcomponents/DashboardUser_Services";

const AdminDashboardWithTabs = ({
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
  keyword,
  setKeyword,
  statusFilter,
  setStatusFilter,
  selectedServiceId,
  setSelectedServiceId,
  selectedDate,
  setSelectedDate,
  services,
  filteredAppointments,
  earliest5Appointments,
  usersOfSelectedService,
  appointmentsOnSelectedDate,
  users,
  latestUsers,
  latestServices,
  relationshipLabel,
  fmtTH,
  fmtTHDateOnly,
  ageYears,
  statusClass,
  statusLabel,
}) => {
  const [activeTab, setActiveTab] = useState("header");

  const tabs = [
    { key: "header", label: "Header" },
    { key: "filter", label: "Filter" },
    { key: "selectedService", label: "Selected Service" },
    { key: "selectDate", label: "Select Date" },
    { key: "user_services", label: "User & Services" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Dashboard Tabs
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
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            services={services}
            filteredAppointments={filteredAppointments}
            earliest5Appointments={earliest5Appointments}
          />
        )}

        {activeTab === "selectedService" && (
          <DashboardSelectedService
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            services={services}
            usersOfSelectedService={usersOfSelectedService}
            fmtTH={fmtTH}
          />
        )}

        {activeTab === "selectDate" && (
          <DashboardSelectDate
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            appointmentsOnSelectedDate={appointmentsOnSelectedDate}
            statusClass={statusClass}
            statusLabel={statusLabel}
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
};

export default AdminDashboardWithTabs;
