/*
  Warnings:

  - You are about to drop the `Partidos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Partidos`;

-- CreateTable
CREATE TABLE `Seleccionados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_seleccion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jugadores_ids` VARCHAR(191) NOT NULL,
    `bots_ids` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partido_confirmado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `capitan_equipo1` VARCHAR(191) NOT NULL,
    `capitan_equipo2` VARCHAR(191) NOT NULL,
    `jugadores_equipo1` VARCHAR(191) NOT NULL,
    `jugadores_equipo2` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
