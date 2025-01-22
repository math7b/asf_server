/*
  Warnings:

  - You are about to drop the column `beeKeeperId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `BeeKeeper` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_beeKeeperId_fkey";

-- DropIndex
DROP INDEX "User_beeKeeperId_key";

-- AlterTable
ALTER TABLE "BeeKeeper" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "beeKeeperId";

-- CreateIndex
CREATE UNIQUE INDEX "BeeKeeper_userId_key" ON "BeeKeeper"("userId");

-- AddForeignKey
ALTER TABLE "BeeKeeper" ADD CONSTRAINT "BeeKeeper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
