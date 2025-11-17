const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "ไม่พบบัญชีผู้ดูแลระบบนี้" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { adminId: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        phone: admin.phone,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

exports.adminRegister = async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    phone,
    address,
  } = req.body;

  try {
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "อีเมลไม่ถูกต้อง" });
    }

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.admin.findUnique({ where: { email } }),
      prisma.admin.findUnique({ where: { username } }),
    ]);

    if (existingEmail)
      return res.status(400).json({ message: "มีผู้ใช้อีเมลนี้อยู่แล้ว" });

    if (existingUsername)
      return res.status(400).json({ message: "มีผู้ใช้ username นี้อยู่แล้ว" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        address,
      },
    });

    res.status(201).json({
      message: "สร้างบัญชีผู้ดูแลระบบสำเร็จ",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        name: `${newAdmin.firstName} ${newAdmin.lastName}`,
        phone: newAdmin.phone,
      },
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};
