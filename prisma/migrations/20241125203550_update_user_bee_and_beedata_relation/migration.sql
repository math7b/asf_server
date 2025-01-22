/*
  Warnings:

  - You are about to drop the column `beeDataId` on the `Bee` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BeeData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[beeId]` on the table `BeeData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `beeId` to the `BeeData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bee" DROP CONSTRAINT "Bee_beeDataId_fkey";

-- DropForeignKey
ALTER TABLE "BeeData" DROP CONSTRAINT "BeeData_userId_fkey";

-- DropIndex
DROP INDEX "Bee_beeDataId_key";

-- AlterTable
ALTER TABLE "Bee" DROP COLUMN "beeDataId";

-- AlterTable
ALTER TABLE "BeeData" DROP COLUMN "userId",
ADD COLUMN     "beeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_BeeDataUpdates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BeeDataUpdates_AB_unique" ON "_BeeDataUpdates"("A", "B");

-- CreateIndex
CREATE INDEX "_BeeDataUpdates_B_index" ON "_BeeDataUpdates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "BeeData_beeId_key" ON "BeeData"("beeId");

-- AddForeignKey
ALTER TABLE "BeeData" ADD CONSTRAINT "BeeData_beeId_fkey" FOREIGN KEY ("beeId") REFERENCES "Bee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeeDataUpdates" ADD CONSTRAINT "_BeeDataUpdates_A_fkey" FOREIGN KEY ("A") REFERENCES "BeeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeeDataUpdates" ADD CONSTRAINT "_BeeDataUpdates_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
