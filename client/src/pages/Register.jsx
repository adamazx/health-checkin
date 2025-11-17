import api from "@/services/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.includes("@")) {
      alert("กรุณากรอกอีเมลที่ถูกต้อง");
      return;
    }

    try {
      await api.post("/auth/register", form);
      alert("สมัครสมาชิกสำเร็จ");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl max-w-3xl w-full py-10 px-8 md:px-12"
      >
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          สมัครสมาชิก
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="md:col-span-2 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              รหัสผ่าน
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 pr-20 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-9 text-sm text-gray-600 hover:text-black"
            >
              {showPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>

          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              ชื่อจริง
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              นามสกุล
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">
              เพศ
            </label>
            <select
              name="gender"
              id="gender"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="UNSPECIFIED">ไม่ระบุ</option>
              <option value="MALE">ชาย</option>
              <option value="FEMALE">หญิง</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium mb-1"
            >
              วันเดือนปีเกิด <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-4 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {form.birthDate && (
              <p className="text-sm text-gray-500 mt-1">
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
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="relationship"
              className="block text-sm font-medium mb-1"
            >
              สถานะความสัมพันธ์
            </label>
            <select
              name="relationship"
              id="relationship"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="SINGLE">โสด</option>
              <option value="IN_RELATIONSHIP">มีคู่</option>
              <option value="MARRIED">แต่งงาน</option>
              <option value="DIVORCED">หม้าย/หย่าร้าง</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="occupation"
              className="block text-sm font-medium mb-1"
            >
              อาชีพ
            </label>
            <input
              type="text"
              name="occupation"
              id="occupation"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 bg-blue-600 hover:bg-blue-800 text-white py-3 rounded w-full font-bold"
        >
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
};

export default Register;
