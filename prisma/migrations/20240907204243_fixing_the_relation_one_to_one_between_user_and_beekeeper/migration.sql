/*
  Warnings:

  - You are about to drop the column `userId` on the `BeeKeeper` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[beeKeeperId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BeeKeeper" DROP CONSTRAINT "BeeKeeper_userId_fkey";

-- DropIndex
DROP INDEX "BeeKeeper_userId_key";

-- AlterTable
ALTER TABLE "BeeKeeper" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "beeKeeperId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_beeKeeperId_key" ON "User"("beeKeeperId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_beeKeeperId_fkey" FOREIGN KEY ("beeKeeperId") REFERENCES "BeeKeeper"("id") ON DELETE SET NULL ON UPDATE CASCADE;
