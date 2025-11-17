import api from "@/services/axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        emailOrUsername,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("เข้าสู่ระบบสำเร็จ");
      navigate("/");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "เข้าสู่ระบบล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left - Form */}
        <div className="flex flex-col justify-center p-10">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
            เข้าสู่ระบบ
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อบัญชีผู้ใช้งาน หรืออีเมล
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ชื่อบัญชี หรืออีเมล"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-16"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[42px] text-sm text-gray-500 hover:text-black"
              >
                {showPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>

            <p className="text-center text-sm text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </form>
        </div>

        {/* Right - Image */}
        <div className="hidden md:block">
          <img
            src="https://img.freepik.com/premium-vector/vector-abstract-seamless-pattern-with-stars-blue-background_117177-1008.jpg"
            alt="Login background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
