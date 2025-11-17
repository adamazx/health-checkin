// สถานะภาษาไทย
export const statusLabel = {
  ALL: "สถานะทั้งหมด",
  PENDING: "รอดำเนินการ",
  CONFIRMED: "ยืนยันแล้ว",
  COMPLETED: "เสร็จสมบูรณ์",
  CANCELED: "ยกเลิกแล้ว",
};

// class สีสำหรับ badge
export const statusClass = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELED: "bg-rose-100 text-rose-700",
};

// สีสำหรับกราฟสถานะ
export const STATUS_COLOR = {
  PENDING: "#f59e0b", // amber-500
  CONFIRMED: "#10b981", // emerald-500
  COMPLETED: "#3b82f6", // blue-500
  CANCELED: "#ef4444", // red-500
};

// สีสำหรับบริการ (Pie Chart)
export const SERVICE_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#eab308",
];

// ความสัมพันธ์
export const relationshipLabel = {
  SINGLE: "โสด",
  IN_RELATIONSHIP: "มีคู่",
  MARRIED: "แต่งงาน",
  DIVORCED: "หม้าย/หย่าร้าง",
};

// เพศ
export const genderLabels = {
  MALE: "ชาย",
  FEMALE: "หญิง",
  UNSPECIFIED: "ไม่ระบุ",
};
