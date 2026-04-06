/*
  Warnings:

  - Added the required column `customerList` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxConcurrentCalls` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxDailyMinutes` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxRetries` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retryDelayMs` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `campaign` ADD COLUMN `customerList` JSON NOT NULL,
    ADD COLUMN `endTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `maxConcurrentCalls` INTEGER NOT NULL,
    ADD COLUMN `maxDailyMinutes` INTEGER NOT NULL,
    ADD COLUMN `maxRetries` INTEGER NOT NULL,
    ADD COLUMN `retryDelayMs` INTEGER NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NOT NULL;
