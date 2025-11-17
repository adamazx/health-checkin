import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const ServiceSelection = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  const handleToggle = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    const selected = services.filter((s) => selectedServices.includes(s.id));
    localStorage.setItem("selectedService", JSON.stringify(selected));
    navigate("/Selectdatetime");
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data);
      } catch (err) {
        console.error("โหลดบริการล้มเหลว", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="md:w-3/4 p-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          เลือกบริการที่คุณต้องการ
        </h1>

        {services.length === 0 ? (
          <p>กำลังโหลดบริการ...</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <label
                key={service.id}
                className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer ${
                  selectedServices.includes(service.id)
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-blue-400"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleToggle(service.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-bold">{service.name}</p>
                    <p className="text-gray-600 text-sm">
                      {service.description || "ไม่มีคำอธิบายเพิ่มเติม"}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>
                    {service.priceType === "PAID"
                      ? `${service.price?.toFixed(2)} บาท`
                      : "ฟรี ไม่มีค่าบริการ"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    ระยะเวลา: {service.duration || 60} นาที
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            disabled={selectedServices.length === 0}
            onClick={handleNext}
            className={`px-6 py-3 rounded-xl font-semibold ${
              selectedServices.length
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            ถัดไป →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
