const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const items = await prisma.notification.findMany({
      where: { userId },
      orderBy: { notifyDate: "desc" },
      take: 100,
    });
    res.json(items);
  } catch (e) {
    console.error("Get notifications failed:", e);
    res.status(500).json({ error: "Get notifications failed" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });
    res.json(updated);
  } catch (e) {
    console.error("Mark read failed:", e.message);
    res.status(500).json({ error: "Mark read failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    await prisma.notification.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error("Delete notification failed:", e.message);
    res.status(500).json({ error: "Delete notification failed" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const onlyRead = String(req.query.onlyRead || "").toLowerCase() === "true";
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const where = { userId, ...(onlyRead ? { isRead: true } : {}) };
    const result = await prisma.notification.deleteMany({ where });
    res.json({ ok: true, deleted: result.count });
  } catch (e) {
    console.error("Bulk delete notifications failed:", e.message);
    res.status(500).json({ error: "Bulk delete notifications failed" });
  }
});


module.exports = router;
