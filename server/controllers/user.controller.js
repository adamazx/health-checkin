const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        gender: true,
        birthDate: true,
        phone: true,
        relationship: true,
        occupation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    res.json(user);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
  }
};


exports.createUser = async (req, res) => {
  try {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender,
        birthDate: new Date(birthDate),
        phone,
        relationship,
        occupation,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "ไม่สามารถเพิ่มผู้ใช้ได้" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "ไม่สามารถดึงผู้ใช้ได้" });
  }
};

exports.searchUsers = async (req, res) => {
  const { keyword, gender, email } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          keyword && {
            OR: [
              { firstName: { contains: keyword, mode: 'insensitive' } },
              { lastName: { contains: keyword, mode: 'insensitive' } },
              { username: { contains: keyword, mode: 'insensitive' } },
              { email: { contains: keyword, mode: 'insensitive' } },
            ],
          },
          gender && { gender },
          email && { email },
        ].filter(Boolean), // ลบ null ออก
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหา" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
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

    const updateData = {
      username,
      email,
      firstName,
      lastName,
      gender,
      birthDate: new Date(birthDate),
      phone,
      relationship,
      occupation,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.preScreening.deleteMany({ where: { userId } });
    await prisma.appointment.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });

    res.sendStatus(204);
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "ไม่สามารถลบผู้ใช้ได้" });
  }
};
