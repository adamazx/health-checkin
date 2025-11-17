import React from "react";

const EditProfileForm = ({
  formData,
  handleChange,
  handleSave,
  handleCancel,
}) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            ชื่อ
          </label>
          <input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="ชื่อ"
            className="border p-3 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            นามสกุล
          </label>
          <input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="นามสกุล"
            className="border p-3 rounded w-full"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            ชื่อผู้ใช้
          </label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="ชื่อผู้ใช้"
            className="border p-3 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            เบอร์โทร
          </label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="เบอร์โทร"
            className="border p-3 rounded w-full"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <label
            htmlFor="occupation"
            className="block text-sm font-medium mb-1"
          >
            อาชีพ
          </label>
          <input
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="อาชีพ"
            className="border p-3 rounded w-full"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700"
        >
          💾 บันทึก
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-xl"
        >
          ❌ ยกเลิก
        </button>
      </div>
    </>
  );
};

export default EditProfileForm;
