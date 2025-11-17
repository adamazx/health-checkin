const prisma = require("../config/prisma");

const buildReminderTimes = (apptDate, now) => {
  const diffMs = apptDate.getTime() - now.getTime();
  const H = 60 * 60 * 1000;
  const D = 24 * H;

  const want = [];
  if (diffMs >= 7 * D) {
    want.push(new Date(apptDate.getTime() - 7 * D));
    want.push(new Date(apptDate.getTime() - 1 * D));
    want.push(new Date(apptDate.getTime() - 2 * H));
  } else if (diffMs >= 1 * D) {
    want.push(new Date(apptDate.getTime() - 1 * D));
    want.push(new Date(apptDate.getTime() - 2 * H));
  } else if (diffMs >= 2 * H) {
    want.push(new Date(apptDate.getTime() - 2 * H));
  } else if (diffMs > 0) {
    want.push(new Date(apptDate.getTime() - 30 * 60 * 1000));
  }
  return want.filter((t) => t.getTime() > now.getTime());
};

const fmtThaiDateTime = (d) => {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "full",
    timeStyle: "short",
    hour12: false,
    timeZone: "Asia/Bangkok",
  }).format(d);
};

const uniqByTime = (arr) => {
  const seen = new Set();
  return arr.filter((x) => {
    const key = x.notifyDate.getTime();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const toInt = (v) => {
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

exports.createAppointment = async (req, res) => {
  try {
    const { serviceIds, date, userId } = req.body;

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res
        .status(400)
        .json({ error: "serviceIds must be a non-empty array" });
    }
    const uid = toInt(userId);
    if (!uid) return res.status(400).json({ error: "Invalid userId" });

    // --- normalize to UTC and zero sec/ms ---
    const parsedDate = new Date(date); // FE ควรส่ง ISO (UTC) มาแล้ว
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    parsedDate.setSeconds(0, 0);

    const now = new Date();
    if (parsedDate.getTime() <= now.getTime()) {
      return res
        .status(400)
        .json({ error: "appointmentDate must be in the future" });
    }

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, email: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const uniqServiceIds = [
      ...new Set(serviceIds.map((x) => toInt(x)).filter(Boolean)),
    ];
    const services = await prisma.service.findMany({
      where: { id: { in: uniqServiceIds } },
      select: { id: true },
    });
    if (services.length !== uniqServiceIds.length) {
      return res.status(400).json({ error: "Some services do not exist" });
    }

    // ===== กันซ้อนแบบช่วงสล็อต 30 นาที =====
    const SLOT_MS = 30 * 60 * 1000;
    const slotStart = parsedDate; // inclusive
    const slotEnd = new Date(slotStart.getTime() + SLOT_MS); // exclusive

    const overlap = await prisma.appointment.findFirst({
      where: {
        userId: uid,
        // ถ้าต้องการนับเฉพาะสถานะที่ยังมีผล: { notIn: ["CANCELED"] }
        status: { not: "CANCELED" },
        appointmentDate: { gte: slotStart, lt: slotEnd },
      },
      select: { id: true },
    });
    if (overlap) {
      return res
        .status(409)
        .json({ error: "You already booked this datetime" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: uid,
        appointmentDate: parsedDate, // เก็บเป็น UTC
        appointments: {
          create: uniqServiceIds.map((serviceId) => ({
            service: { connect: { id: serviceId } },
          })),
        },
      },
      include: {
        appointments: { include: { service: true } },
      },
    });

    // ===== สร้าง notification (ตัวเดียวที่เหมาะกับเวลาที่เหลือ) =====
    const apptDate = new Date(parsedDate); // UTC
    const serviceNames = (appointment.appointments || [])
      .map((x) => x?.service?.name)
      .filter(Boolean);
    const servicesText = serviceNames.length
      ? `บริการ: ${serviceNames.join(", ")}`
      : "";
    const times = buildReminderTimes(apptDate, new Date()); // คืน array ของเวลาที่ควรเตือน (อนาคตเท่านั้น)

    if (times.length > 0) {
      const H = 60 * 60 * 1000,
        D = 24 * H;
      const whenText = fmtThaiDateTime(new Date(apptDate)); // แปลงเป็น Asia/Bangkok ตอนแสดง
      // เลือก “ตัวเดียว” โดยหลักการ: เอาตัวหน้าสุดจาก buildReminderTimes (ไกลสุดที่ยังทัน)
      const t = times[0];
      const aheadMs = apptDate.getTime() - t.getTime();
      let prefix = "แจ้งเตือนนัดหมาย";
      if (Math.abs(aheadMs - 7 * D) <= 1000) prefix = "เตือนล่วงหน้า 7 วัน";
      else if (Math.abs(aheadMs - 1 * D) <= 1000)
        prefix = "เตือนล่วงหน้า 1 วัน";
      else if (Math.abs(aheadMs - 2 * H) <= 1000)
        prefix = "เตือนล่วงหน้า 2 ชั่วโมง";
      else if (Math.abs(aheadMs - 30 * 60 * 1000) <= 1000)
        prefix = "เตือนล่วงหน้า 30 นาที";

      await prisma.notification.create({
        data: {
          userId: uid,
          message: [`${prefix}: คุณมีนัดตรวจสุขภาพ`, whenText, servicesText]
            .filter(Boolean)
            .join("\n"),
          notifyDate: t, // เก็บเป็น UTC
        },
      });
    }

    console.log("Creating appointment:", {
      userId: uid,
      serviceIds: uniqServiceIds,
      date: apptDate.toISOString(),
    });
    return res.status(201).json(appointment);
  } catch (error) {
    console.error("Create appointment failed", error);
    return res.status(500).json({ error: "Create appointment failed" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const uid = req.query.userId ? toInt(req.query.userId) : null;

    const appointments = await prisma.appointment.findMany({
      where: uid ? { userId: uid } : undefined,
      include: {
        user: true,
        appointments: { include: { service: true } },
        healthStatus: true,
      },
      orderBy: [{ appointmentDate: "asc" }, { createdAt: "desc" }],
    });

    console.log("Querying appointments for userId:", uid ?? "ALL");
    return res.json(appointments);
  } catch (error) {
    console.error("Get appointments failed:", error);
    return res.status(500).json({ error: "Get appointments failed" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
        appointments: { include: { service: true } },
        healthStatus: true,
      },
    });

    if (!appointment) return res.status(404).json({ error: "Not found" });
    return res.json(appointment);
  } catch (error) {
    console.error("Get appointment failed:", error);
    return res.status(500).json({ error: "Get appointment failed" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const { status, appointmentDate } = req.body;

    const data = {};
    if (status) {
      const allowed = new Set([
        "PENDING",
        "CONFIRMED",
        "CANCELED",
        "COMPLETED",
      ]);
      if (!allowed.has(status))
        return res.status(400).json({ error: "Invalid status" });
      data.status = status;
    }
    if (appointmentDate) {
      const d = new Date(appointmentDate);
      if (Number.isNaN(d.getTime()))
        return res.status(400).json({ error: "Invalid appointmentDate" });
      if (d.getTime() <= Date.now())
        return res
          .status(400)
          .json({ error: "appointmentDate must be in the future" });
      data.appointmentDate = d;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        appointments: { include: { service: true } },
        healthStatus: true,
      },
    });

    console.log("Updated appointment:", { id, ...data });
    return res.json(appointment);
  } catch (error) {
    console.error("Update appointment failed:", error);
    return res.status(500).json({ error: "Update appointment failed" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    await prisma.$transaction(async (tx) => {
      await tx.appointmentService.deleteMany({ where: { appointmentId: id } });
      await tx.healthStatus.deleteMany({ where: { appointmentId: id } });
      await tx.appointment.delete({ where: { id } });
    });

    return res.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Delete appointment failed", error);
    return res.status(500).json({ error: "Delete appointment failed" });
  }
};
