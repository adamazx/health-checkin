const { PrismaClient } = require("@prisma/client");

let prisma;
if (global.__prisma) {
  prisma = global.__prisma;
} else {
  prisma = new PrismaClient();
  global.__prisma = prisma;
}

(async () => {
  try {
    await prisma.$executeRawUnsafe("SET time_zone = '+00:00'");
  } catch (e) {
    console.error("SET time_zone failed:", e);
  }
})();

module.exports = prisma;
