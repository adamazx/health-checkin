import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";

const Userfrom = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    relationship: "",
    occupation: "",
    userId: null,
    serviceId: null,
    appointmentDate: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const selectedDate = localStorage.getItem("selectedDate");

    if (user?.id) {
      fetch(`http://localhost:5000/api/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            ...data,
            birthDate: data.birthDate.split("T")[0],
            userId: data.id,
            appointmentDate: selectedDate || null,
          }));
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    if (!formData.appointmentDate) {
      alert("กรุณาเลือกวันที่นัดหมายก่อน");
      return;
    }

    localStorage.setItem("appointmentUser", JSON.stringify(formData));
    navigate("/Summary");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:w-3/4 p-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          กรอกข้อมูลส่วนตัวของคุณ
        </h1>

        <form className="space-y-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                ชื่อจริง
              </label>
              <input
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                นามสกุล
              </label>
              <input
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                อีเมล
              </label>
              <input
                name="email"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                เบอร์โทรศัพท์ (10 หลัก)
              </label>
              <input
                name="phone"
                id="phone"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                วันเกิด
              </label>
              <input
                name="birthDate"
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                เลือกเพศ
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              >
                <option value="">-- เลือกเพศ --</option>
                <option value="MALE">ชาย</option>
                <option value="FEMALE">หญิง</option>
                <option value="UNSPECIFIED">ไม่ระบุ</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="relationship" className="block text-sm font-medium mb-1">
                สถานะความสัมพันธ์
              </label>
              <select
                name="relationship"
                id="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full border p-3 rounded"
                required
              >
                <option value="">-- เลือกสถานะ --</option>
                <option value="SINGLE">โสด</option>
                <option value="IN_RELATIONSHIP">มีแฟน</option>
                <option value="MARRIED">แต่งงานแล้ว</option>
                <option value="OTHER">อื่น ๆ</option>
              </select>
            </div>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium mb-1">
                อาชีพ
              </label>
              <input
                name="occupation"
                id="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
            </div>
          </div>

          <div className="text-right pt-6">
            <button
              type="button"
              onClick={handleNext}
              disabled={!formData.appointmentDate}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                formData.appointmentDate
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              ต่อไป →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Userfrom;
