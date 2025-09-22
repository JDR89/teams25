/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Jugadores` ADD COLUMN `selected` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Admin`;
