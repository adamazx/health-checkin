import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import axios from "axios";

const Summary = () => {
  const [summary, setSummary] = useState({
    services: [],
    datetime: null,
    user: null,
  });

  const navigate = useNavigate();

  const formatThaiDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString("th-TH", { month: "long" });
    const year = date.getFullYear() + 543;
    return `วันที่ ${day} ${month} พ.ศ. ${year}`;
  };

  useEffect(() => {
    const services = JSON.parse(localStorage.getItem("selectedService")) || [];
    const datetime = localStorage.getItem("selectedDate");
    const user =
      JSON.parse(localStorage.getItem("appointmentUser")) ||
      JSON.parse(localStorage.getItem("user"));
    setSummary({ services, datetime, user });
  }, []);
  const payload = {
    userId: summary.user?.userId || summary.user?.id,
    date: new Date(summary.datetime).toISOString(),
    serviceIds: summary.services.map((s) => s.id), // <-- array
  };

  const handleConfirm = async () => {
    const userId = summary.user?.userId || summary.user?.id;

    if (summary.services.length === 0 || !summary.datetime || !userId) {
      alert("ข้อมูลไม่ครบ กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    try {
      const payload = {
        userId: userId,
        date: new Date(summary.datetime).toISOString(),
        serviceIds: summary.services.map((s) => s.id),
      };

      await axios.post("http://localhost:5000/api/appointments", payload);

      alert("นัดหมายสำเร็จ!");
      localStorage.removeItem("selectedService");
      localStorage.removeItem("selectedDate");
      localStorage.removeItem("appointmentUser");
      navigate("/Selectsuccess");
    } catch (err) {
      console.error("เกิดข้อผิดพลาด", err.response?.data || err.message);
      alert(err.response?.data?.error || "ไม่สามารถบันทึกการนัดหมายได้");
    }
    console.log("📦 summary = ", summary);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="md:w-3/4 p-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          สรุปข้อมูลการนัดหมาย
        </h1>
        <p className="text-gray-600 mb-6">
          กรุณายืนยันการจองของคุณโดยตรวจสอบรายละเอียดด้านล่างนี้
        </p>

        <div>
          <h2 className="font-semibold text-lg mb-1">บริการที่เลือก</h2>
          {summary.services.length > 0 ? (
            summary.services.map((service, index) => (
              <div
                key={service.id}
                className="mb-4 pl-4 border-l-4 border-blue-400"
              >
                <p className="font-semibold">{service.name}</p>
                <p className="text-gray-700 text-sm">
                  {service.priceType === "PAID"
                    ? `${service.price?.toFixed(2)} บาท`
                    : "ฟรี ไม่มีค่าบริการ"}
                </p>
                <p className="text-gray-700 text-sm">
                  ระยะเวลา: {service.duration || 60} นาที
                </p>
              </div>
            ))
          ) : (
            <p className="text-red-500">[ไม่มีบริการที่เลือก]</p>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">วันและเวลา</h2>
          <p className="text-gray-700 mb-6">
            {summary.datetime
              ? formatThaiDate(summary.datetime)
              : "ไม่พบวันนัดหมาย"}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-1">รายละเอียดของคุณ</h2>
          <p className="text-gray-700 mb-6">
            {summary.user?.firstName} {summary.user?.lastName}
            <br />
            {summary.user?.email}
            <br />
            {summary.user?.phone}
          </p>
        </div>

        <button
          onClick={handleConfirm}
          className="mt-10 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
        >
          ยืนยันการนัดหมาย →
        </button>
      </div>
    </div>
  );
};

export default Summary;
