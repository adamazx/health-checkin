const cron = require("node-cron");
const prisma = require("../config/prisma");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);

  try {
    const due = await prisma.notification.findMany({
      where: {
        notifyDate: { gte: tenMinAgo, lte: now },
        sentAt: null,
      },
      include: { user: true },
      take: 50,
    });

    for (const n of due) {
      try {
        const to = n.user?.email;
        if (!to) {
          console.warn(`Skip notif ${n.id}: user ${n.userId} has no email`);
          await prisma.notification.update({
            where: { id: n.id },
            data: { sentAt: new Date() },
          });
          continue;
        }

        await transporter.sendMail({
          from: `"Health Check-In" <${process.env.MAIL_USER}>`,
          to,
          subject: "แจ้งเตือนนัดหมาย",
          text: n.message,
        });

        await prisma.notification.update({
          where: { id: n.id },
          data: { sentAt: new Date() },
        });
      } catch (err) {
        console.error(`ส่งแจ้งเตือนล้มเหลว (id=${n.id}):`, err.message);
      }
    }
  } catch (e) {
    console.error("Cron query failed:", e.message);
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
