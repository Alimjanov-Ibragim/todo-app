/*
  Warnings:

  - Made the column `userId` on table `Todos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Todos` DROP FOREIGN KEY `Todos_userId_fkey`;

-- DropIndex
DROP INDEX `Todos_userId_fkey` ON `Todos`;

-- AlterTable
ALTER TABLE `Todos` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Todos` ADD CONSTRAINT `Todos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
