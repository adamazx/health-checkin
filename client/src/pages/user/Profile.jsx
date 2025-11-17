import { useEffect, useState } from "react";
import axios from "axios";
import EditProfileForm from "@/components/profile/Editprofile";
import AppointmentRow from "@/components/profile/AppointmentRow";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id) {
      axios
        .get(`http://localhost:5000/api/users/${storedUser.id}`)
        .then((res) => {
          setUser(res.data);
          setFormData(res.data);
        });

      axios
        .get(`http://localhost:5000/api/appointments?userId=${storedUser.id}`)
        .then((res) => setAppointments(res.data));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, formData);
      alert("อัปเดตข้อมูลเรียบร้อยแล้ว");
      setUser(formData);
      setEditMode(false);
    } catch (error) {
      alert("ไม่สามารถอัปเดตข้อมูลได้");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          👤 ข้อมูลโปรไฟล์
        </h1>

        {user ? (
          <div className="space-y-4">
            {editMode ? (
              <EditProfileForm
                formData={formData}
                handleChange={handleChange}
                handleSave={handleSave}
                handleCancel={() => setEditMode(false)}
              />
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 text-lg text-gray-700">
                  <p>
                    <span className="font-bold">ชื่อ:</span> {user.firstName}{" "}
                    {user.lastName}
                  </p>
                  <p>
                    <span className="font-bold">ชื่อผู้ใช้:</span>{" "}
                    {user.username}
                  </p>
                  <p>
                    <span className="font-bold">เบอร์โทร:</span> {user.phone}
                  </p>
                  <p>
                    <span className="font-bold">อาชีพ:</span>{" "}
                    {user.occupation || "-"}
                  </p>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                >
                  แก้ไขข้อมูล
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-600">กำลังโหลดข้อมูลผู้ใช้...</p>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          📅 ประวัติการนัดหมาย
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-600">ยังไม่มีประวัติการนัดหมาย</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-center">
              <thead className="bg-blue-100 text-blue-800 font-semibold">
                <tr>
                  <th className="p-3 border">บริการ</th>
                  <th className="p-3 border">วันที่</th>
                  <th className="p-3 border">สถานะ</th>
                  <th className="p-3 border">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appt) => (
                  <AppointmentRow
                    key={appt.id}
                    appt={appt}
                    onCancel={(cancelledId) => {
                      setAppointments((prev) =>
                        prev.map((a) =>
                          a.id === cancelledId
                            ? { ...a, status: "CANCELLED" }
                            : a
                        )
                      );
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
