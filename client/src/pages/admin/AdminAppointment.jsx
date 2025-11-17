import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const API_BASE = "http://localhost:5000";
const PAGE_SIZE = 10;

const statusLabel = {
  PENDING: "รอดำเนินการ",
  CONFIRMED: "ยืนยันแล้ว",
  CANCELED: "ยกเลิกแล้ว",
  COMPLETED: "เสร็จสมบูรณ์",
};

const statusClass = {
  PENDING: "bg-yellow-50 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  CANCELED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
};

function fmtThaiDateTime(d) {
  try {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
    }).format(new Date(d));
  } catch {
    return "-";
  }
}

export default function AdminAppointment() {
  // data state
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // edit state
  const [editId, setEditId] = useState(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [saving, setSaving] = useState(false);

  // UI/filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // fetcher
  const fetchAppointments = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await axios.get(`${API_BASE}/api/appointments`);
      setAppointments(data || []);
    } catch (e) {
      console.error("โหลดข้อมูลล้มเหลว", e);
      setErr("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // derived: filter + search
  const filtered = useMemo(() => {
    let rows = appointments;
    if (statusFilter !== "ALL") {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (q.trim()) {
      const key = q.toLowerCase();
      rows = rows.filter((r) => {
        const name = `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.toLowerCase();
        const services = (r.appointments || [])
          .map((x) => x?.service?.name || "")
          .join(" ")
          .toLowerCase();
        return (
          name.includes(key) ||
          services.includes(key) ||
          String(r.id).includes(key)
        );
      });
    }
    // เรียงนัดหมายล่าสุดก่อน (ใกล้วันนี้บนสุด)
    return [...rows].sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );
  }, [appointments, q, statusFilter]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visible = useMemo(
    () => filtered.slice(pageStart, pageStart + PAGE_SIZE),
    [filtered, pageStart]
  );

  const startEdit = (appt) => {
    setEditId(appt.id);
    setNewStatus(appt.status);
    // เลื่อนหน้าจอไปด้านบนส่วนแก้ไขนิดหน่อย (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewStatus("PENDING");
  };

  const handleSave = async () => {
    if (!editId) return;
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/api/appointments/${editId}`, {
        status: newStatus,
      });
      cancelEdit();
      fetchAppointments();
    } catch (e) {
      console.error("เปลี่ยนสถานะล้มเหลว", e);
      alert("เปลี่ยนสถานะล้มเหลว");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนัดหมายนี้?")) return;
    try {
      await axios.delete(`${API_BASE}/api/appointments/${id}`);
      // ถ้าลบรายการที่กำลังแก้ไขอยู่ ให้ปิดแผงแก้ไข
      if (editId === id) cancelEdit();
      fetchAppointments();
    } catch (e) {
      console.error("ลบนัดหมายไม่สำเร็จ", e);
      alert("ลบนัดหมายไม่สำเร็จ");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <h1 className="text-3xl font-bold">จัดการนัดหมายทั้งหมด</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหา: ชื่อ, บริการ, เลขนัด"
            className="border rounded px-3 py-2 w-72"
          />

          <select
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="PENDING">{statusLabel.PENDING}</option>
            <option value="CONFIRMED">{statusLabel.CONFIRMED}</option>
            <option value="CANCELED">{statusLabel.CANCELED}</option>
            <option value="COMPLETED">{statusLabel.COMPLETED}</option>
          </select>

          <Button onClick={fetchAppointments}>รีเฟรช</Button>
        </div>
      </div>

      {/* Edit panel */}
      {editId && (
        <div className="mb-8 border p-5 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">แก้ไขสถานะนัดหมาย</h2>
          {appointments
            .filter((a) => a.id === editId)
            .map((a) => (
              <div key={a.id} className="mb-4 text-gray-700 space-y-1">
                <p>
                  ผู้ใช้:{" "}
                  <span className="font-medium">
                    {a.user?.firstName} {a.user?.lastName}
                  </span>
                </p>
                <p>
                  วัน-เวลา:{" "}
                  <span className="font-medium">{fmtThaiDateTime(a.appointmentDate)}</span>
                </p>
                <p>
                  บริการ:{" "}
                  <span className="font-medium">
                    {a.appointments?.length
                      ? a.appointments.map((s) => s.service?.name).join(", ")
                      : "-"}
                  </span>
                </p>
              </div>
            ))}

          <label htmlFor="status" className="block font-medium mb-1">
            สถานะนัดหมาย
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border p-2 rounded w-full max-w-xs mb-4"
          >
            {Object.entries(statusLabel).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "กำลังบันทึก..." : "ยืนยันการแก้ไข"}
            </Button>
            <Button variant="destructive" onClick={cancelEdit}>
              ยกเลิก
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : err ? (
        <p className="text-red-600">{err}</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600">ไม่พบนัดหมายที่ตรงเงื่อนไข</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">เลขนัด</th>
                  <th className="border p-2">ชื่อผู้ใช้</th>
                  <th className="border p-2">บริการ</th>
                  <th className="border p-2">วัน-เวลา</th>
                  <th className="border p-2">สถานะ</th>
                  <th className="border p-2">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((appt) => (
                  <tr key={appt.id} className="border-t hover:bg-gray-50">
                    <td className="border p-2 text-center">{appt.id}</td>

                    <td className="border p-2">
                      {appt.user?.firstName} {appt.user?.lastName}
                      <div className="text-xs text-gray-500">{appt.user?.email}</div>
                    </td>

                    <td className="border p-2">
                      {appt.appointments?.length > 0 ? (
                        appt.appointments.map((s, idx) => (
                          <span key={s.service?.id || idx} className="block">
                            {idx + 1}. {s.service?.name || "ไม่ทราบชื่อบริการ"}
                          </span>
                        ))
                      ) : (
                        <span className="text-red-500">ไม่มีบริการ</span>
                      )}
                    </td>

                    <td className="border p-2">{fmtThaiDateTime(appt.appointmentDate)}</td>

                    <td className="border p-2">
                      <span
                        className={[
                          "inline-block text-xs px-2 py-1 rounded border",
                          statusClass[appt.status],
                        ].join(" ")}
                      >
                        {statusLabel[appt.status]}
                      </span>
                    </td>

                    <td className="border p-2 text-center space-x-2">
                      <Button onClick={() => startEdit(appt)}>แก้ไข</Button>
                      <Button variant="destructive" onClick={() => handleDelete(appt.id)}>
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              แสดง {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
            </div>
            <div className="flex gap-2">
              <Button
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                variant="secondary"
              >
                ← ก่อนหน้า
              </Button>
              <span className="px-2 py-2 text-sm">
                หน้า {currentPage} / {totalPages}
              </span>
              <Button
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                variant="secondary"
              >
                ถัดไป →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
