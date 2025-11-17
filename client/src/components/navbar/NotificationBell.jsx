import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("th");

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const ref = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const fetchUnreadAndLatest = useCallback(
    async (signal) => {
      if (!user?.id) return;
      setErr(null);
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/api/notifications`, {
          params: { userId: user.id },
          signal,
          withCredentials: true,
        });
        setUnread(data.filter((n) => !n.isRead).length);
        setLatest(data.slice(0, 5));
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError") {
          setErr(e.message || "โหลดการแจ้งเตือนล้มเหลว");
        }
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchUnreadAndLatest(controller.signal);

    const tick = () => {
      if (document.visibilityState === "visible") {
        fetchUnreadAndLatest();
      }
    };
    const t = setInterval(tick, 30000);

    const onVisible = () => {
      if (document.visibilityState === "visible") fetchUnreadAndLatest();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      controller.abort();
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchUnreadAndLatest]);

  useEffect(() => {
    const handler = (e) => {
      if (open && ref.current && !ref.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const unreadIds = latest.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setLatest((prev) =>
      prev.map((n) => (unreadIds.includes(n.id) ? { ...n, isRead: true } : n))
    );
    setUnread((prev) => Math.max(0, prev - unreadIds.length));

    (async () => {
      try {
        await Promise.all(
          unreadIds.map((id) =>
            axios.patch(
              `${API_BASE}/api/notifications/${id}/read`,
              {},
              { withCredentials: true }
            )
          )
        );
      } catch {
        fetchUnreadAndLatest();
      }
    })();
  }, [open, latest, fetchUnreadAndLatest]);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="notifications"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V8.25A6 6 0 006 8.25v1.5a8.967 8.967 0 01-2.311 6.022c1.78.68 3.647 1.14 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 text-xs bg-red-600 text-white rounded-full px-1.5"
            aria-live="polite"
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          role="menu"
          aria-label="รายการการแจ้งเตือน"
        >
          <div className="p-3 border-b">
            <p className="font-semibold">การแจ้งเตือน</p>
            <p className="text-xs text-gray-500">อัปเดตล่าสุด</p>
          </div>

          <ul className="max-h-80 overflow-auto divide-y">
            {loading && (
              <li className="p-3 text-sm text-gray-500">กำลังโหลด…</li>
            )}
            {err && <li className="p-3 text-sm text-red-600">{err}</li>}
            {!loading && !err && latest.length === 0 && (
              <li className="p-3 text-sm text-gray-500">
                ยังไม่มีการแจ้งเตือน
              </li>
            )}

            {latest.map((n) => (
              <li key={n.id} className="p-3">
                <p className="text-sm">{n.message}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {dayjs(n.notifyDate).fromNow()} •{" "}
                  {new Date(n.notifyDate).toLocaleString("th-TH")}
                </p>
                {!n.isRead && (
                  <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                    ยังไม่อ่าน
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="p-2 border-t">
            <Link
              to="/notifications"
              className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
              onClick={() => setOpen(false)}
            >
              ดูทั้งหมด →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
