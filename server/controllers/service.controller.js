const prisma = require("../config/prisma");

// ดึงข้อมูลบริการทั้งหมด
exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลบริการได้" });
  }
};

// สร้างบริการใหม่
exports.createService = async (req, res) => {
  try {
    const { name, description, priceType, price, adminId, duration } = req.body;

    if (!["FREE", "PAID"].includes(priceType)) {
      return res
        .status(400)
        .json({ message: "ประเภทราคาต้องเป็น FREE หรือ PAID" });
    }

    const parsedPrice = priceType === "PAID" ? parseFloat(price) : null;
    if (priceType === "PAID" && (isNaN(parsedPrice) || parsedPrice < 0)) {
      return res.status(400).json({ message: "กรุณาระบุราคาที่ถูกต้อง" });
    }

    const parsedAdminId = Number(adminId);
    if (isNaN(parsedAdminId)) {
      return res.status(400).json({ message: "adminId ไม่ถูกต้องหรือไม่พบ" });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        priceType,
        price: parsedPrice,
        duration: duration ?? null,
        adminId: parsedAdminId,
      },
    });

    res.status(201).json(newService);
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ message: "ไม่สามารถสร้างบริการได้" });
  }
};

// อัปเดตบริการ
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, priceType, price, duration, adminId } = req.body;

  if (!["FREE", "PAID"].includes(priceType)) {
    return res
      .status(400)
      .json({ message: "ประเภทราคาต้องเป็น FREE หรือ PAID เท่านั้น" });
  }

  let parsedPrice = null;
  if (priceType === "PAID") {
    parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "กรุณากรอกราคาที่ถูกต้อง" });
    }
  }

  const parsedAdminId = Number(adminId);
  if (isNaN(parsedAdminId)) {
    return res.status(400).json({ message: "adminId ไม่ถูกต้องหรือไม่พบ" });
  }

  try {
    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        priceType,
        price: parsedPrice,
        duration: Number(duration),
        adminId: parsedAdminId,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ message: "ไม่สามารถแก้ไขบริการได้" });
  }
};

// ลบบริการ
exports.deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.service.delete({ where: { id: Number(id) } });
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ message: "ไม่สามารถลบบริการได้" });
  }
};
