/*
  Warnings:

  - You are about to alter the column `capitan1` on the `Sorteos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `capitan2` on the `Sorteos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Sorteos` MODIFY `capitan1` INTEGER NOT NULL,
    MODIFY `capitan2` INTEGER NOT NULL;
