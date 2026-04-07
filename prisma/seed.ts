import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.campaign.createMany({
    data: [
      {
        id: "1",
        name: "Campaign 1",
        status: "draft",

        customerList: ["01000000001", "01000000002", "01000000003"],

        startTime: "09:00",
        endTime: "17:00",

        maxConcurrentCalls: 3,
        maxDailyMinutes: 120,
        maxRetries: 2,
        retryDelayMs: 3600000,
      },
      {
        id: "2",
        name: "Campaign 2",
        status: "paused",

        customerList: ["01100000001", "01100000002"],

        startTime: "10:00",
        endTime: "18:00",

        maxConcurrentCalls: 2,
        maxDailyMinutes: 60,
        maxRetries: 1,
        retryDelayMs: 1800000,
      },
    ],
    skipDuplicates: true, // مهم عشان مايحصلش duplicate error
  });

  console.log("Seed data inserted successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeder error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });