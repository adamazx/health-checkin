import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );
      const { token, admin } = res.data;

      localStorage.setItem("admin", JSON.stringify(admin));
      localStorage.setItem("token", token);

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          เข้าสู่ระบบผู้ดูแล
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          name="emailOrUsername"
          placeholder="Email หรือ Username"
          value={form.emailOrUsername}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-3 border rounded-md"
          required
        />
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md pr-16"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-600 hover:text-black"
            title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          >
            {showPassword ? "ซ่อน" : "แสดง"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
