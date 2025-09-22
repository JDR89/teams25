/*
  Warnings:

  - You are about to drop the column `selected` on the `Bots` table. All the data in the column will be lost.
  - You are about to drop the column `captain` on the `Jugadores` table. All the data in the column will be lost.
  - You are about to drop the column `captain_count` on the `Jugadores` table. All the data in the column will be lost.
  - You are about to drop the column `selected` on the `Jugadores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Bots` DROP COLUMN `selected`;

-- AlterTable
ALTER TABLE `Jugadores` DROP COLUMN `captain`,
    DROP COLUMN `captain_count`,
    DROP COLUMN `selected`;
