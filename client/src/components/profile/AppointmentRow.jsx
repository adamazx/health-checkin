import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statusLabels = {
  PENDING: "รอดำเนินการ",
  CONFIRMED: "ยืนยันแล้ว",
  CANCELED: "ยกเลิกแล้ว",
  COMPLETED: "เสร็จสมบูรณ์",
};

const statusColors = {
  PENDING: "text-yellow-500",
  CONFIRMED: "text-blue-600",
  CANCELED: "text-red-500",
  COMPLETED: "text-green-600",
};

const AppointmentRow = ({ appt, onCancel }) => {
  const [status, setStatus] = useState(appt.status);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCancel = async () => {
    const confirm = window.confirm("คุณต้องการยกเลิกการนัดหมายนี้ใช่หรือไม่?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/api/appointments/${appt.id}`, {
        status: "CANCELED",
      });
      setStatus("CANCELED");
      onCancel(appt.id);
    } catch (err) {
      console.error("ยกเลิกไม่สำเร็จ", err);
      alert("เกิดข้อผิดพลาดในการยกเลิกนัด");
    }
  };

  const confirmViewSlip = () => {
    localStorage.setItem("appointmentSlip", JSON.stringify(appt));
    navigate("/Appointment-Slip");
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="border text-left p-2">
          {appt.appointments?.length > 0 ? (
            appt.appointments.map((s, index) => (
              <span key={s.service?.id || index} className="block">
                {index + 1}. {s.service?.name || "ไม่ทราบชื่อบริการ"}
              </span>
            ))
          ) : (
            <span className="text-red-500">ไม่มีบริการ</span>
          )}
        </td>

        <td className="border text-left p-2">
          {new Date(appt.appointmentDate).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </td>
        <td className={`border p-2 font-semibold ${statusColors[status]}`}>
          {statusLabels[status] || status}
        </td>
        <td className="border p-2 space-x-2 text-center">
          <button
            title="ดูรายละเอียดใบนัด"
            onClick={() => setShowModal(true)}
            className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            ใบนัด
          </button>

          {status !== "CANCELED" && (
            <button
              onClick={handleCancel}
              className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              ยกเลิก
            </button>
          )}
        </td>
      </tr>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ดูใบนัด
            </h2>
            <p className="text-gray-600 mb-4">
              คุณต้องการดูรายละเอียดใบนัดของบริการนี้ใช่หรือไม่?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmViewSlip}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                ไปยังใบนัด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentRow;
