import { useEffect, useMemo, useState } from "react";
import api from "@/services/axios";
import { Button } from "@/components/ui/button";

const defaultForm = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  gender: "UNSPECIFIED",
  birthDate: new Date().toISOString().split("T")[0],
  phone: "",
  relationship: "SINGLE",
  occupation: "",
};

const genderLabels = {
  MALE: "ชาย",
  FEMALE: "หญิง",
  UNSPECIFIED: "ไม่ระบุ",
};

const relationshipLabels = {
  SINGLE: "โสด",
  IN_RELATIONSHIP: "มีคู่",
  MARRIED: "แต่งงาน",
  DIVORCED: "หม้าย/หย่าร้าง",
};

const PAGE_SIZE = 8;

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ค้นหา/กรอง/เรียง/เพจจิเนชัน
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [page, setPage] = useState(1);

  const resetForm = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowPassword(false);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      setError("ไม่สามารถดึงรายชื่อผู้ใช้งานได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==== validation เล็กน้อยฝั่ง client ====
  const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);
  const isValidPhone = (val) => /^\d{9,10}$/.test(val || "");
  const isValidBirthDate = (val) => {
    const d = new Date(val);
    return !Number.isNaN(d.getTime());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // validate ก่อนส่ง
    if (!form.username.trim()) return setError("กรุณากรอกชื่อผู้ใช้");
    if (!isValidEmail(form.email)) return setError("อีเมลไม่ถูกต้อง");
    if (!editId && !form.password) return setError("กรุณากรอกรหัสผ่าน");
    if (!isValidBirthDate(form.birthDate)) return setError("วันเกิดไม่ถูกต้อง");
    if (form.phone && !isValidPhone(form.phone))
      return setError("เบอร์โทรต้องเป็นตัวเลข 9–10 หลัก");

    try {
      setSubmitting(true);
      if (editId) {
        await api.put(`/users/${editId}`, form);
      } else {
        await api.post("/users", form);
      }
      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      ...defaultForm,
      ...user,
      birthDate: user.birthDate?.slice(0, 10) || defaultForm.birthDate,
      password: "", // ห้ามเติมรหัสผ่านเก่า
    });
    setEditId(user.id);
    setShowPassword(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("ยืนยันการลบผู้ใช้นี้?")) {
      try {
        await api.delete(`/users/${id}`);
        await fetchUsers();
      } catch (err) {
        setError("ลบไม่สำเร็จ");
      }
    }
  };

  // ====== filter/sort/paginate ======
  const filtered = useMemo(() => {
    let arr = [...users];

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((u) =>
        [
          u.username,
          u.email,
          u.firstName,
          u.lastName,
          u.phone,
          u.occupation,
        ]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(q))
      );
    }

    if (genderFilter) {
      arr = arr.filter((u) => u.gender === genderFilter);
    }

    switch (sortBy) {
      case "createdAt_desc":
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "createdAt_asc":
        arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name_asc":
        arr.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`,
            "th"
          )
        );
        break;
      case "name_desc":
        arr
          .sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`,
              "th"
            )
          )
          .reverse();
        break;
      default:
        break;
    }

    return arr;
  }, [users, query, genderFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    // ถ้ากรอง/ค้นหาแล้วหน้าปัจจุบันเกิน ให้เด้งกลับหน้า 1
    setPage(1);
  }, [query, genderFilter, sortBy]);

  return (
    <div className="p-6">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-3xl font-bold">จัดการข้อมูลผู้ใช้งาน</h2>
        <div className="text-sm text-gray-600">
          รวมทั้งหมด: <b>{users.length}</b> รายการ • แสดงผล:{" "}
          <b>{filtered.length}</b> รายการ
        </div>
      </div>

      {/* ฟอร์ม */}
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
          <label className="block mb-1 font-medium">ชื่อผู้ใช้</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">อีเมล</label>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded"
            placeholder="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="relative">
          <label className="block mb-1 font-medium">
            รหัสผ่าน {editId && <span className="text-xs text-gray-500">(เว้นว่างได้หากไม่เปลี่ยน)</span>}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder={editId ? "(ไม่เปลี่ยนให้เว้นว่าง)" : "********"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editId}
            className="w-full border px-4 py-2 pr-16 rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] text-sm text-gray-600 hover:text-black"
          >
            {showPassword ? "ซ่อน" : "แสดง"}
          </button>
        </div>

        <div>
          <label className="block mb-1 font-medium">ชื่อจริง</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="ชื่อจริง"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">นามสกุล</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="นามสกุล"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">เพศ</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="UNSPECIFIED">ไม่ระบุ</option>
            <option value="MALE">ชาย</option>
            <option value="FEMALE">หญิง</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">วันเกิด</label>
          <input
            type="date"
            className="w-full border px-4 py-2 rounded"
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          />
          {form.birthDate && (
            <p className="text-sm text-gray-600 mt-1">
              วันที่เลือก:{" "}
              {new Date(form.birthDate).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">เบอร์โทรศัพท์</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value.replace(/[^\d]/g, "").slice(0, 10),
              })
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">สถานะความสัมพันธ์</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
          >
            <option value="SINGLE">โสด</option>
            <option value="IN_RELATIONSHIP">มีคู่</option>
            <option value="MARRIED">แต่งงาน</option>
            <option value="DIVORCED">หม้าย/หย่าร้าง</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">อาชีพ</label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="อาชีพ"
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
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
              ? "บันทึกการแก้ไข"
              : "เพิ่มผู้ใช้"}
          </Button>
        </div>
      </form>

      {/* แถบค้นหา/กรอง/เรียง */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="ค้นหา: ชื่อ, อีเมล, เบอร์โทร, อาชีพ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">ทุกเพศ</option>
          <option value="MALE">ชาย</option>
          <option value="FEMALE">หญิง</option>
          <option value="UNSPECIFIED">ไม่ระบุ</option>
        </select>
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

      {/* ตาราง */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-600">กำลังโหลด...</div>
        ) : (
          <table className="table-auto w-full border">
            <thead className="bg-blue-50">
              <tr>
                <th className="border p-2">ชื่อบัญชี</th>
                <th className="border p-2">ชื่อ-นามสกุล</th>
                <th className="border p-2">อีเมล</th>
                <th className="border p-2">เพศ</th>
                <th className="border p-2">วันเกิด</th>
                <th className="border p-2">สถานะ</th>
                <th className="border p-2">เบอร์โทร</th>
                <th className="border p-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border p-2">{u.username}</td>
                  <td className="border p-2">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{genderLabels[u.gender]}</td>
                  <td className="border p-2">
                    {new Date(u.birthDate).toLocaleDateString("th-TH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border p-2">
                    {relationshipLabels[u.relationship]}
                  </td>
                  <td className="border p-2">{u.phone}</td>
                  <td className="border p-2 text-center space-x-2">
                    <Button onClick={() => handleEdit(u)}>แก้ไข</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(u.id)}
                    >
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}

              {pageSlice.length === 0 && (
                <tr>
                  <td className="border p-4 text-center text-gray-500" colSpan={8}>
                    ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา
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

export default ManageUser;
