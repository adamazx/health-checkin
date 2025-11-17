import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchAll = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/notifications`, {
        params: { userId: user.id },
        withCredentials: true,
      });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const markRead = async (id) => {
    // optimistic
    setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await axios.patch(`${API_BASE}/api/notifications/${id}/read`, {}, { withCredentials: true });
    } catch {
      // revert
      setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: false } : n)));
    }
  };

  const markAllRead = async () => {
    const unreadIds = items.filter(i => !i.isRead).map(i => i.id);
    if (unreadIds.length === 0) return;
    // optimistic
    const before = items;
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await Promise.all(unreadIds.map(id =>
        axios.patch(`${API_BASE}/api/notifications/${id}/read`, {}, { withCredentials: true })
      ));
    } catch {
      setItems(before); // revert ทั้งก้อนถ้าล้มเหลว
    }
  };

  const deleteOne = async (id) => {
    // ยืนยันก่อนลบ
    if (!confirm("ต้องการลบการแจ้งเตือนนี้หรือไม่?")) return;
    // optimistic
    const before = items;
    setItems(prev => prev.filter(n => n.id !== id));
    try {
      await axios.delete(`${API_BASE}/api/notifications/${id}`, { withCredentials: true });
    } catch {
      setItems(before); // revert
      alert("ลบไม่สำเร็จ");
    }
  };

  const deleteAllRead = async () => {
    const readIds = items.filter(i => i.isRead).map(i => i.id);
    if (readIds.length === 0) return;
    if (!confirm(`ลบที่อ่านแล้วทั้งหมดจำนวน ${readIds.length} รายการ?`)) return;

    const before = items;
    // optimistic
    setItems(prev => prev.filter(n => !n.isRead));
    try {
      // ถ้า backend มี bulk endpoint ใช้อันนั้นได้
      // ที่นี่ทำแบบขนานเรียกทีละ id เพื่อใช้ได้ทันที
      await Promise.all(readIds.map(id =>
        axios.delete(`${API_BASE}/api/notifications/${id}`, { withCredentials: true })
      ));
    } catch {
      setItems(before); // revert
      alert("ลบไม่สำเร็จ");
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">การแจ้งเตือน</h1>
        <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อดูการแจ้งเตือน</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">การแจ้งเตือน</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded"
          >
            ทำเครื่องหมายว่าอ่านทั้งหมด
          </button>
          <button
            onClick={deleteAllRead}
            className="text-sm px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200"
          >
            ลบที่อ่านแล้วทั้งหมด
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">กำลังโหลด...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">ยังไม่มีการแจ้งเตือน</p>
      ) : (
        <ul className="space-y-3">
          {items.map(n => (
            <li
              key={n.id}
              className={`p-4 border rounded-md ${n.isRead ? "bg-white" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    แจ้งเมื่อ: {new Date(n.notifyDate).toLocaleString("th-TH")}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      อ่านแล้ว
                    </button>
                  )}
                  <button
                    onClick={() => deleteOne(n.id)}
                    className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    title="ลบการแจ้งเตือน"
                    aria-label="ลบการแจ้งเตือน"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
