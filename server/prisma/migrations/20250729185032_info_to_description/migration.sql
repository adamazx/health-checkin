/*
  Warnings:

  - You are about to drop the column `info` on the `service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `service` DROP COLUMN `info`,
    ADD COLUMN `description` VARCHAR(191) NULL;
