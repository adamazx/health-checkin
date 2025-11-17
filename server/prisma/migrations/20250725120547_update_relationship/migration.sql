/*
  Warnings:

  - Made the column `relationship` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `relationship` INTEGER NOT NULL;
