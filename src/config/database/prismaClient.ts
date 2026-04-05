import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// Graceful shutdown handler
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;