/*
  Warnings:

  - Added the required column `priceType` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service` ADD COLUMN `price` DOUBLE NULL,
    ADD COLUMN `priceType` ENUM('FREE', 'PAID') NOT NULL;
