/*
  Warnings:

  - You are about to drop the column `clinicId` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `registrationId` on the `healthstatus` table. All the data in the column will be lost.
  - You are about to drop the `clinic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `holiday` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workingschedule` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `HealthStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentId` to the `HealthStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_clinicId_fkey`;

-- DropForeignKey
ALTER TABLE `healthstatus` DROP FOREIGN KEY `HealthStatus_registrationId_fkey`;

-- DropForeignKey
ALTER TABLE `holiday` DROP FOREIGN KEY `Holiday_clinicId_fkey`;

-- DropForeignKey
ALTER TABLE `registration` DROP FOREIGN KEY `Registration_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `registration` DROP FOREIGN KEY `Registration_userId_fkey`;

-- DropForeignKey
ALTER TABLE `service` DROP FOREIGN KEY `Service_clinicId_fkey`;

-- DropForeignKey
ALTER TABLE `workingschedule` DROP FOREIGN KEY `WorkingSchedule_clinicId_fkey`;

-- DropIndex
DROP INDEX `Appointment_clinicId_fkey` ON `appointment`;

-- DropIndex
DROP INDEX `HealthStatus_registrationId_key` ON `healthstatus`;

-- DropIndex
DROP INDEX `Service_clinicId_fkey` ON `service`;

-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `clinicId`,
    DROP COLUMN `date`,
    ADD COLUMN `appointmentDate` DATETIME(3) NULL,
    ADD COLUMN `registerAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `healthstatus` DROP COLUMN `registrationId`,
    ADD COLUMN `appointmentId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `clinic`;

-- DropTable
DROP TABLE `holiday`;

-- DropTable
DROP TABLE `registration`;

-- DropTable
DROP TABLE `workingschedule`;

-- CreateIndex
CREATE UNIQUE INDEX `HealthStatus_appointmentId_key` ON `HealthStatus`(`appointmentId`);

-- AddForeignKey
ALTER TABLE `HealthStatus` ADD CONSTRAINT `HealthStatus_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
