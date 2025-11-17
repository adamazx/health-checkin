/*
  Warnings:

  - You are about to alter the column `gender` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.
  - You are about to alter the column `relationship` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `gender` ENUM('UNSPECIFIED', 'MALE', 'FEMALE') NOT NULL,
    MODIFY `relationship` ENUM('SINGLE', 'IN_RELATIONSHIP', 'MARRIED', 'DIVORCED') NOT NULL;
