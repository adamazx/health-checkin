const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (process.env.NODE_ENV !== "production") {
    console.table({
      emailOrUsername,
      password: "(hidden)",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) return res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้นี้" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    gender,
    birthDate,
    phone,
    relationship,
    occupation,
  } = req.body;

  console.table({
    username,
    email,
    password,
    firstName,
    lastName,
    gender,
    birthDate,
    phone,
    relationship,
    occupation,
  });

  try {
    if (!email.includes("@")) {
      return res.status(400).json({ message: "อีเมลไม่ถูกต้อง" });
    }

    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !birthDate
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const parsedDate = new Date(birthDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "วันเดือนปีเกิดไม่ถูกต้อง" });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername)
      return res
        .status(400)
        .json({ message: "มีผู้ใช้ชื่อ username นี้อยู่แล้ว" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "มีผู้ใช้อีเมลนี้อยู่แล้ว" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        birthDate: parsedDate,
        phone,
        relationship,
        occupation,
      },
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: "สร้างบัญชีผู้ใช้สำเร็จ", user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};
