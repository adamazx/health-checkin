import { useEffect, useMemo, useState } from "react";
import api from "@/services/axios";
import { Button } from "@/components/ui/button";

const defaultForm = {
  name: "",
  description: "",
  priceType: "FREE",
  price: "",
  duration: "",
};

const PAGE_SIZE = 8;

const ManageService = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ค้นหา/เรียง/เพจจิเนชัน
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [page, setPage] = useState(1);

  const resetForm = () => {
    setForm(defaultForm);
    setEditId(null);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/services");
      setServices(res.data || []);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลบริการได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ===== validation ฝั่ง client แบบเบา ๆ =====
  const validate = () => {
    if (!form.name.trim()) return "กรุณาระบุชื่อบริการ";
    if (!form.duration || Number(form.duration) <= 0)
      return "ระยะเวลาต้องมากกว่า 0 นาที";
    if (form.priceType === "PAID") {
      const p = Number(form.price);
      if (Number.isNaN(p) || p < 0) return "กรุณาระบุราคาที่ถูกต้อง";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin?.id) {
      setError("ไม่พบข้อมูลผู้ดูแลระบบ (adminId)");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      priceType: form.priceType,
      price: form.priceType === "PAID" ? Number(form.price) : null,
      duration: Number(form.duration),
      adminId: admin.id,
    };

    try {
      setSubmitting(true);
      if (editId) {
        await api.put(`/services/${editId}`, payload);
      } else {
        await api.post("/services", payload);
      }
      resetForm();
      await fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name ?? "",
      description: service.description ?? "",
      priceType: service.priceType ?? "FREE",
      price: service.price ?? "",
      duration: service.duration ?? "",
    });
    setEditId(service.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("ยืนยันการลบบริการนี้?")) {
      try {
        await api.delete(`/services/${id}`);
        await fetchServices();
      } catch {
        setError("ลบไม่สำเร็จ");
      }
    }
  };

  // ===== filter/sort/paginate =====
  const filtered = useMemo(() => {
    let arr = [...services];
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((s) =>
        [s.name, s.description]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case "createdAt_desc":
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "createdAt_asc":
        arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name_asc":
        arr.sort((a, b) => (a.name || "").localeCompare(b.name || "", "th"));
        break;
      case "name_desc":
        arr
          .sort((a, b) => (a.name || "").localeCompare(b.name || "", "th"))
          .reverse();
        break;
      default:
        break;
    }
    return arr;
  }, [services, query, sortBy]);

  useEffect(() => setPage(1), [query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <div className="p-6">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-3xl font-bold">จัดการข้อมูลบริการ</h2>
        <div className="text-sm text-gray-600">
          รวมทั้งหมด: <b>{services.length}</b> รายการ • แสดงผล:{" "}
          <b>{filtered.length}</b> รายการ
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-4 mb-10 bg-gray-50 p-6 rounded-lg border"
      >
        {error && (
          <div className="md:col-span-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">ชื่อบริการ</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="ชื่อบริการ"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">รายละเอียด</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="รายละเอียดเพิ่มเติม"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ประเภทค่าบริการ</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={form.priceType}
            onChange={(e) =>
              setForm({
                ...form,
                priceType: e.target.value,
                price: e.target.value === "FREE" ? "" : form.price,
              })
            }
          >
            <option value="FREE">ฟรี</option>
            <option value="PAID">มีค่าใช้จ่าย</option>
          </select>
        </div>

        {form.priceType === "PAID" && (
          <div>
            <label className="block mb-1 font-medium">ราคาบริการ (บาท)</label>
            <input
              className="w-full border px-4 py-2 rounded"
              type="number"
              min="0"
              step="0.01"
              placeholder="เช่น 100"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">ระยะเวลา (นาที)</label>
          <input
            className="w-full border px-4 py-2 rounded"
            type="number"
            min="1"
            placeholder="เช่น 30"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-2 justify-end mt-4">
          {editId && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              className="px-4 py-2"
            >
              ยกเลิกแก้ไข
            </Button>
          )}
          <Button type="submit" className="px-6 py-2" disabled={submitting}>
            {submitting
              ? "กำลังบันทึก..."
              : editId
              ? "💾 บันทึกการแก้ไข"
              : "➕ เพิ่มบริการ"}
          </Button>
        </div>
      </form>

      {/* ค้นหา/เรียง */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="ค้นหา: ชื่อ/รายละเอียดบริการ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt_desc">ล่าสุด → เก่า</option>
          <option value="createdAt_asc">เก่า → ล่าสุด</option>
          <option value="name_asc">ชื่อ A → Z</option>
          <option value="name_desc">ชื่อ Z → A</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-600">กำลังโหลด...</div>
        ) : (
          <table className="table-auto w-full border">
            <thead className="bg-blue-50">
              <tr>
                <th className="border p-2">ชื่อบริการ</th>
                <th className="border p-2">รายละเอียด</th>
                <th className="border p-2">ราคา</th>
                <th className="border p-2">ระยะเวลา</th>
                <th className="border p-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.description || "-"}</td>
                  <td className="border p-2">
                    {s.priceType === "FREE"
                      ? "ฟรี"
                      : `${Number(s.price)
                          .toLocaleString("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 2,
                          })
                          .replace("THB", "฿")}`}
                  </td>
                  <td className="border p-2">{s.duration} นาที</td>
                  <td className="border p-2 text-center space-x-2">
                    <Button onClick={() => handleEdit(s)}>แก้ไข</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(s.id)}
                    >
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td
                    className="border p-4 text-center text-gray-500"
                    colSpan={5}
                  >
                    ไม่พบข้อมูลบริการ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* เพจจิเนชัน */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          หน้า {currentPage} / {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← ก่อนหน้า
          </Button>
          <Button
            variant="secondary"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ถัดไป →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageService;
