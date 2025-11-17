// formatter วันเวลาแบบไทย
export const fmtTH = (d) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  }).format(new Date(d));

export const fmtTHDateOnly = (d) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
  }).format(new Date(d));

export const ageYears = (birthDate) => {
  if (!birthDate) return "-";
  const b = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};
