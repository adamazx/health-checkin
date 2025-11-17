import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";

const Selectsuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("selectedClinic");
    localStorage.removeItem("selectedService");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedDateTime");
    localStorage.removeItem("appointmentUser");

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="md:w-3/4 p-10 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ จองนัดหมายสำเร็จ!
        </h1>
        <p className="text-gray-700 mb-6">
          ขอบคุณที่ใช้บริการ ระบบจะพาคุณกลับไปยังหน้าหลักในไม่ช้า...
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
        >
          กลับหน้าหลักทันที
        </button>
      </div>
    </div>
  );
};

export default Selectsuccess;
