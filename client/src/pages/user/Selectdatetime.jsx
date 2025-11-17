import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "@/components/sidebar/Sidebar";

const WORKING_HOURS = { start: 10, end: 17 };
const STEP_MINUTES = 30;

const pad = (n) => (n < 10 ? `0${n}` : String(n));
const toHHMM = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;
const parseHHMM = (hhmm) => {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
};

const withinWorkingHours = (hhmm, startHour, endHour) => {
  if (!hhmm) return false;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return false;
  if (h < startHour) return false;
  if (h > endHour) return false;
  if (h === endHour && m > 0) return false;
  if (m < 0 || m > 59) return false;
  return true;
};

const notPastForToday = (dateOnly, hhmm) => {
  const now = new Date();
  const d = new Date(dateOnly);
  if (now.toDateString() !== d.toDateString()) return true;

  const [h, m] = hhmm.split(":").map(Number);
  const chosen = new Date(d);
  chosen.setHours(h, m, 0, 0);
  return chosen.getTime() >= now.getTime();
};

function buildTimeSlots(startHour, endHour, stepMinutes) {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const label = `${pad(h)}:${pad(m)}`;
      slots.push(label);
    }
  }
  return slots.filter((t) => {
    const { h, m } = parseHHMM(t);
    return !(h === endHour && m > 0);
  });
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameLocalDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

const ALL_SLOTS = buildTimeSlots(
  WORKING_HOURS.start,
  WORKING_HOURS.end,
  STEP_MINUTES
);

export default function Selectdatetime() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedDate");
      if (saved) {
        const d = new Date(saved);
        if (!Number.isNaN(d.getTime())) return startOfDay(d);
      }
    } catch {}
    return startOfDay(new Date());
  });

  const [selectedTime, setSelectedTime] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedDate");
      if (saved) {
        const d = new Date(saved);
        if (!Number.isNaN(d.getTime())) return toHHMM(d);
      }
    } catch {}
    return "";
  });

  const availableSlots = useMemo(() => {
    const now = new Date();
    if (!isSameLocalDay(now, selectedDate)) return ALL_SLOTS;

    const currentHH = now.getHours();
    const currentMM = now.getMinutes();

    return ALL_SLOTS.filter((t) => {
      const { h, m } = parseHHMM(t);
      if (h > currentHH) return true;
      if (h === currentHH && m >= currentMM) return true;
      return false;
    });
  }, [selectedDate]);

  const canContinue =
    Boolean(selectedDate && selectedTime) &&
    withinWorkingHours(selectedTime, WORKING_HOURS.start, WORKING_HOURS.end) &&
    notPastForToday(selectedDate, selectedTime);

  const handleNext = () => {
    if (!canContinue) return;
    const dt = new Date(selectedDate);
    const parsed = parseHHMM(selectedTime);
    dt.setHours(parsed.h, parsed.m, 0, 0);
    localStorage.setItem("selectedDate", dt.toISOString());
    navigate("/Userfrom");
  };

  const minTime = `${pad(WORKING_HOURS.start)}:00`;
  const maxTime = `${pad(WORKING_HOURS.end)}:00`;
  const stepAttr = STEP_MINUTES * 60; // seconds

  const preview = useMemo(() => {
    if (!canContinue) return "";
    const parsed = parseHHMM(selectedTime);
    const dt = new Date(selectedDate);
    dt.setHours(parsed.h, parsed.m, 0, 0);
    return dt.toLocaleString("th-TH");
  }, [selectedDate, selectedTime, canContinue]);

  const pickSlot = (t) => setSelectedTime(t);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="md:w-3/4 p-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          เลือกวันและเวลาในการนัดหมาย
        </h1>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-xl shadow-lg w-fit">
            <Calendar
              onChange={(d) => setSelectedDate(startOfDay(d))}
              value={selectedDate}
              locale="th-TH"
              minDate={new Date()}
              // tileDisabled={({ date }) => date.getDay() === 0}
            />
          </div>

          {/* Time picker */}
          <div className="bg-white p-6 rounded-xl shadow-lg w-full">
            <p className="font-semibold mb-3">เลือกเวลา</p>

            {/* Quick pick: ปุ่ม slot */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {availableSlots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => pickSlot(t)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm border transition",
                    selectedTime === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-blue-50 text-gray-700 border-gray-200",
                  ].join(" ")}
                >
                  {t} น.
                </button>
              ))}
              {availableSlots.length === 0 && (
                <span className="text-sm text-gray-500 col-span-full">
                  วันนี้ไม่มีเวลาเหลือ โปรดเลือกวันอื่น
                </span>
              )}
            </div>

            {/* กรอกเวลาแบบเจาะจง (นาทีไหนก็ได้) */}
            <input
              type="time"
              step={60} 
              min={minTime} 
              max={maxTime} 
              className="mt-3 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedTime}
              onChange={(e) => {
                const v = e.target.value; // "HH:MM"
                setSelectedTime(v);
              }}
            />

            {/* ข้อความช่วย / error */}
            <div className="mt-2 text-xs">
              {!selectedTime ? (
                <span className="text-gray-500">กรุณาเลือกหรือกรอกเวลา</span>
              ) : !withinWorkingHours(
                  selectedTime,
                  WORKING_HOURS.start,
                  WORKING_HOURS.end
                ) ? (
                <span className="text-red-600">
                  เวลานอกช่วงให้บริการ ({minTime}–{maxTime})
                </span>
              ) : !notPastForToday(selectedDate, selectedTime) ? (
                <span className="text-red-600">
                  เวลาที่เลือกผ่านไปแล้ว โปรดเลือกเวลาใหม่
                </span>
              ) : (
                <span className="text-green-600">เวลาใช้งานได้</span>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              {canContinue ? (
                <span>
                  คุณเลือก: <strong>{preview}</strong>
                </span>
              ) : (
                <span>กรุณาเลือกวันที่และเวลา</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className={`px-6 py-3 rounded-xl font-semibold ${
              canContinue
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            ต่อไป →
          </button>
        </div>
      </div>
    </div>
  );
}
