import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusLabels = {
  PENDING: "รอดำเนินการ",
  CONFIRMED: "ยืนยันแล้ว",
  CANCELED: "ยกเลิกแล้ว",
  COMPLETED: "เสร็จสมบูรณ์",
};

const AppointmentSlip = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAppt = JSON.parse(localStorage.getItem("appointmentSlip"));
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedAppt || !storedUser) {
      alert("ไม่พบข้อมูลใบนัด");
      navigate("/profile");
      return;
    }

    setAppointment(storedAppt);

    fetch(`http://localhost:5000/api/users/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        alert("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      });
  }, []);

  const thDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear() + 543;
    return date
      .toLocaleDateString("th-TH", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .replace(`${date.getFullYear()}`, year);
  };

  const genderLabels = {
    MALE: "ชาย",
    FEMALE: "หญิง",
    UNSPECIFIED: "ไม่ระบุ",
  };

  const relationshipLabels = {
    SINGLE: "โสด",
    IN_RELATIONSHIP: "มีแฟน",
    MARRIED: "แต่งงานแล้ว",
    DIVORCED: "หม้าย/หย่าร้าง",
  };

  if (!appointment || !user) return null;
  console.log("user:", user);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-center text-2xl font-bold text-blue-800 mb-6">
          🧾 ใบนัดหมายตรวจสุขภาพ
        </h1>

        <div className="text-gray-800 text-sm space-y-3">
          <p>
            <strong>ชื่อ - นามสกุล:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>ชื่อผู้ใช้:</strong> {user.username}
          </p>
          <p>
            <strong>เพศ:</strong> {genderLabels[user.gender] || "ไม่ระบุ"}
          </p>
          <p>
            <strong>วันเกิด:</strong> {thDate(user.birthDate)}
          </p>
          <p>
            <strong>สถานะความสัมพันธ์:</strong>{" "}
            {relationshipLabels[user.relationship] || "ไม่ระบุ"}
          </p>
          <p>
            <strong>อีเมล:</strong> {user.email}
          </p>
          <p>
            <strong>เบอร์โทร:</strong> {user.phone}
          </p>
          <p>
            <strong>อาชีพ:</strong> {user.occupation || "-"}
          </p>
          <hr />
          <p>
            <strong>วันที่นัดหมาย:</strong>{" "}
            <span className="text-blue-700 font-semibold">
              {thDate(appointment.appointmentDate)}
            </span>
          </p>

          <p>
            <strong>บริการ:</strong>
          </p>
          {appointment.appointments && appointment.appointments.length > 0 ? (
            <div className="ml-4 space-y-1">
              {appointment.appointments.map((item, idx) => (
                <span key={idx} className="block">
                  {idx + 1}. {item.service?.name || "ไม่ทราบชื่อบริการ"}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-red-500 ml-4">-</p>
          )}

          <p>
            <strong>สถานะ: </strong>
            {statusLabels[appointment.status] || appointment.status}
          </p>
        </div>

        <div className="mt-6 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            🖨️ พิมพ์ใบนัด
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSlip;
